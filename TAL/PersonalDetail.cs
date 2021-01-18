using System;

namespace TAL
{
    public enum Profession
    {
        Cleaner = 1,
        Doctor,
        Author,
        Farmer,
        Mechanic,
        Florist
    }
    public class PersonalDetail
    {
        public DateTime DateOfBirth { get; set; }

        public int Age { get; set; }

        public string Name { get; set; }

        public Profession OccupationId { get; set; }

        public double DeathSumInsured { get; set; }
    }
}
