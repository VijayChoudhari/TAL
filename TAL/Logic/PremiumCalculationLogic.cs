using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TAL.Common;

namespace TAL.Logic
{
    public class PremiumCalculationLogic : IPremiumCalculationLogic
    {
        public enum Occupation {
            Professional,
            WhiteCollar,
            LightManual,
            HeavyManual
        }

        private class ProfessionOccupationMapping {
            internal Profession Profession { get; set; }
            internal Occupation Occupation { get; set; }
        }

        private static List<ProfessionOccupationMapping> occupationMappings 
            = new List<ProfessionOccupationMapping>() 
            { new ProfessionOccupationMapping(){Profession= Profession.Cleaner, Occupation= Occupation.LightManual },
             new ProfessionOccupationMapping(){Profession= Profession.Doctor, Occupation= Occupation.Professional },
             new ProfessionOccupationMapping(){Profession= Profession.Author, Occupation= Occupation.WhiteCollar },
             new ProfessionOccupationMapping(){Profession= Profession.Farmer, Occupation= Occupation.HeavyManual },
             new ProfessionOccupationMapping(){Profession= Profession.Mechanic, Occupation= Occupation.HeavyManual },
             new ProfessionOccupationMapping(){Profession= Profession.Florist, Occupation= Occupation.LightManual }
            };



        private double GetOccupationRatingValue(Occupation occupationRating) {

            double retVal = 0;

            switch (occupationRating) {
                case Occupation.Professional:
                    retVal = 1;
                    break;
                case Occupation.WhiteCollar:
                    retVal = 1.25;
                    break;
                case Occupation.LightManual:
                    retVal = 1.5;
                    break;
                case Occupation.HeavyManual:
                    retVal = 1.75;
                    break;
                default:
                    throw new BusinessException("Unsupported occupation type");
                    break;

            }

            return retVal;
        }

        private double GetOccupationRatingValueByProfession(Profession profession)
        {

            double retVal = 0; 
            Occupation occupation = occupationMappings.Where(x => x.Profession == profession).Select(o => o.Occupation).FirstOrDefault();
            if (occupation == null)
            {
                throw new BusinessException("Unsupported profession type");
            }

            retVal = GetOccupationRatingValue(occupation);
            return retVal;
        }

        double IPremiumCalculationLogic.CalculateMontlyPremium(PersonalDetail personalDetail)
        {

            ValidatePersonalInformation(personalDetail);

            // Monthly Death Premium = (Death Cover amount * Occupation Rating Factor * Age) /1000 * 12  
            double monthlyDeathPremium = 0;
            double occupationRatingFactor = 0;

            occupationRatingFactor = GetOccupationRatingValueByProfession((Profession)personalDetail.OccupationId);
            monthlyDeathPremium = (personalDetail.DeathSumInsured * occupationRatingFactor * personalDetail.Age) / (1000 * 12);
            double retVal = Math.Round(monthlyDeathPremium, 2);

            return retVal;
        }

        private void ValidatePersonalInformation(PersonalDetail personalDetail)
        {
            if (personalDetail == null)
            {
                throw new BusinessException("Personal Details are required");
            }


            //Name validation
            if(string.IsNullOrEmpty(personalDetail.Name))
            {
                throw new BusinessException("Name is required");
            }

            if(personalDetail.Name.Length > 50)
            {
                throw new BusinessException("Name is too long");
            }


            //Age Validation
            if((personalDetail.Age <= 0) || (personalDetail.Age > 80)) 
            {
                throw new BusinessException("Age should be upto 80");
            }

            //Validated age and DOB
            var today = DateTime.Today;
            var calculatedAge = today.Year - personalDetail.DateOfBirth.Year;
            if (personalDetail.DateOfBirth > today.AddYears(-calculatedAge)) calculatedAge--;

            if (calculatedAge != personalDetail.Age)
            { 
                throw new BusinessException("Incorrect birthdate or entered age");
            }

            if (personalDetail.DateOfBirth > today)
            { 
                throw new BusinessException("Incorrect birthdate");
            }

            if (personalDetail.DeathSumInsured <= 0)
            { 
                throw new BusinessException("Invalid death sum");
            }

            if(false == new Profession[] {Profession.Author,
                Profession.Cleaner, Profession.Doctor, Profession.Farmer,
                Profession.Florist, Profession.Mechanic}.Contains((Profession)personalDetail.OccupationId))
                { 
                throw new BusinessException("Invalid Occupation");

            }
        }
    }
}
