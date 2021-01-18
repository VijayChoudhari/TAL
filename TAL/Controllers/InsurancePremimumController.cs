using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TAL.Common;
using TAL.Logic;

namespace TAL.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InsurancePremimumController : ControllerBase
    {

        private readonly ILogger<InsurancePremimumController> _logger;
        private readonly IPremiumCalculationLogic _premiumCalculationLogic;


        public InsurancePremimumController(ILogger<InsurancePremimumController> logger, IPremiumCalculationLogic premiumCalculationLogic)
        {
            _logger = logger;
            _premiumCalculationLogic = premiumCalculationLogic;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PersonalDetail personalDetails)
        {
            double retVal = 0;
            try
            {
                retVal = _premiumCalculationLogic.CalculateMontlyPremium(personalDetails);
                return Ok(retVal);
            }
            catch (BusinessException be)
            {
                return BadRequest(be.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
