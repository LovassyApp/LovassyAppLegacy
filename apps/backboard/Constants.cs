using System.Collections.Generic;

namespace Backboard
{
    public class Constants
    {
        public static Dictionary<string, string> FieldMappings = new Dictionary<string, string>()
        {
            { "student_name", "Tanuló név" },
            { "school_class", "Tanuló osztálya" },
            { "om_code", "Tanuló azonosítója" },
            { "subject_category", "Tárgy kategória" },
            { "subject", "Tantárgy" },
            { "group", "Osztály/Csoport név" },
            { "teacher", "Pedagógus név" },
            { "type", "Értékelés módja" },
            { "textGrade", "Osztályzat" },
            { "grade", "Jegy" },
            { "name", "Téma" },
            { "shortTextGrade", "Szöveges értékelés" },
            { "percentageGrade", "Százalékos értékelés" },
            { "behaviourGrade", "Magatartás" },
            { "diligenceGrade", "Szorgalom" },
            { "createDate", "Bejegyzés dátuma" },
            { "recordDate", "Rögzítés dátuma" },
        };
    }
}