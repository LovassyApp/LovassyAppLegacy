using System;

namespace Backboard
{
    public class Grade {
        public readonly string subject_category;
        public readonly string subject;
        public readonly string group;
        public readonly string teacher;
        public readonly string type;
        public readonly string textGrade;
        public readonly string grade;
        public readonly string shortTextGrade;
        public readonly string behaviourGrade;
        public readonly string diligenceGrade;
        public readonly string createDate;
        public readonly string recordDate;
        public readonly string name;

        public Grade(string subjectCategory, string subject, string group, string teacher, string type,
            string textGrade, string grade, string shortTextGrade, string behaviourGrade, string diligenceGrade,
            string createDate, string recordDate, string name)
        {
            subject_category = subjectCategory ?? throw new ArgumentNullException(nameof(subjectCategory));
            this.subject = subject ?? throw new ArgumentNullException(nameof(subject));
            this.group = group ?? throw new ArgumentNullException(nameof(group));
            this.teacher = teacher ?? throw new ArgumentNullException(nameof(teacher));
            this.type = type ?? throw new ArgumentNullException(nameof(type));
            this.textGrade = textGrade ?? throw new ArgumentNullException(nameof(textGrade));
            this.grade = grade ?? throw new ArgumentNullException(nameof(grade));
            this.shortTextGrade = shortTextGrade ?? throw new ArgumentNullException(nameof(shortTextGrade));
            this.behaviourGrade = behaviourGrade ?? throw new ArgumentNullException(nameof(behaviourGrade));
            this.diligenceGrade = diligenceGrade ?? throw new ArgumentNullException(nameof(diligenceGrade));
            this.createDate = createDate ?? throw new ArgumentNullException(nameof(createDate));
            this.recordDate = recordDate ?? throw new ArgumentNullException(nameof(recordDate));
            this.name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}