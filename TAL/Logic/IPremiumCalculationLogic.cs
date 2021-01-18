using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TAL.Logic
{
    public interface IPremiumCalculationLogic
    {
        double CalculateMontlyPremium(PersonalDetail personalDetail);
    }
}
