using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Security.Cryptography;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Sodium;
using System.Net.Http.Json;

namespace Backboard
{
    public class GradeCollection
    {
        public readonly string school_class;
        public readonly string student_name;
        private string key_encrypted;
        private string key;
        public readonly BlueboardUserObject user;
        public readonly List<Grade> grades;

        public GradeCollection(BlueboardUserObject user, string school_class, List<Grade> grades, string student_name)
        {
            this.school_class = school_class;
            this.user = user;
            this.grades = grades;
            this.student_name = student_name;
        }

        private static string BytesToHex(byte[] bytes)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }

            return builder.ToString();
        }

        private void GenerateKey()
        {
            this.key = IlluminateEncrypter.RandomString(32);
            var encryptedBytes = SealedPublicKeyBox.Create(Encoding.UTF8.GetBytes(this.key), user.public_key);
            this.key_encrypted = BytesToHex(encryptedBytes);
        }

        private string toJson()
        {
            return JsonConvert.SerializeObject(this);
        }

        public JsonContent MakeMessage()
        {
            this.GenerateKey();
            var enc = IlluminateEncrypter.Encrypt(this.toJson(), this.key);
            var message = new { key_encrypted = this.key_encrypted, message_encrypted = enc, user_id = user.id};
            return JsonContent.Create(message);
        }

        private static string shaHash(string input)
        {
            using (SHA256 hasher = SHA256.Create())
            {
                byte[] hash_bytes = hasher.ComputeHash(Encoding.UTF8.GetBytes(input));
                return BytesToHex(hash_bytes);
            }
        }

        private static Grade ConvertToGrade(Dictionary<string, string> rawGrade)
        {
            return new Grade(rawGrade[Constants.FieldMappings["subject_category"]],
                rawGrade[Constants.FieldMappings["subject"]], rawGrade[Constants.FieldMappings["group"]],
                rawGrade[Constants.FieldMappings["teacher"]], rawGrade[Constants.FieldMappings["type"]],
                rawGrade[Constants.FieldMappings["textGrade"]], rawGrade[Constants.FieldMappings["grade"]],
                rawGrade[Constants.FieldMappings["shortTextGrade"]],
                rawGrade[Constants.FieldMappings["behaviourGrade"]],
                rawGrade[Constants.FieldMappings["diligenceGrade"]], rawGrade[Constants.FieldMappings["createDate"]],
                rawGrade[Constants.FieldMappings["recordDate"]], rawGrade[Constants.FieldMappings["name"]]);
        }

        private static List<Grade> MakeGradeList(IGrouping<string, Dictionary<string, string>> gradesRaw)
        {
            List<Grade> ret = new List<Grade>();
            foreach (var rawGrade in gradesRaw)
            {
                ret.Add(ConvertToGrade(rawGrade));
            }

            return ret;
        }

        public static void ConvertAndSend(List<Dictionary<string, string>> rawGrades, List<BlueboardUserObject> users,
            BackgroundWorker worker, BlueboardClient client)
        {
            var om_code_name = Constants.FieldMappings["om_code"];
            var grouped = rawGrades.GroupBy(s => s[om_code_name]);
            int counter = 0;
            foreach (var grades in grouped)
            {
                var om_code = grades.First()[om_code_name];
                var user = users.Find(obj => obj.om_code_hashed == shaHash(om_code));
                counter++;

                if (user == null)
                {
                    worker.ReportProgress(
                        (int)Math.Ceiling((decimal)counter / (decimal)grouped.Count() * (decimal)100));
                    continue;
                }

                List<Grade> parsed_grades = MakeGradeList(grades);
                string student_class;
                try {
                    student_class =
                    grades.Select(s => s[Constants.FieldMappings["school_class"]]).ToList().FindAll(s => s != "")
                        .Distinct().First();
                } catch(Exception ex)
                {
                    student_class = String.Empty;
                }
                 
                string student_name =
                    grades.Select(s => s[Constants.FieldMappings["student_name"]]).Distinct().First();

                GradeCollection coll = new GradeCollection(user, student_class, parsed_grades, student_name);
                client.UploadData(coll);
                
                worker.ReportProgress((int)Math.Ceiling((decimal)counter / (decimal)grouped.Count() * (decimal)100));
            }
        }
    }
}