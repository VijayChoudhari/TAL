using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TAL.Common;
using TAL.Logic;

namespace TAL.Test
{
    [TestClass]
    public class PremiumCalculationTest
    {
        private IPremiumCalculationLogic premiumLogic;

        public PremiumCalculationTest()
        {
            premiumLogic = new PremiumCalculationLogic();
        }

        [TestMethod]
        public void TestPremiumCalculation()
        {
            var personalDetail = new PersonalDetail()
            {
                Name = "Vijay",
                Age = 10,
                DateOfBirth = new DateTime(2011, 1, 1),
                OccupationId = Profession.Author,
                DeathSumInsured = 50000000
            };

            var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            Assert.AreEqual(52083.33, calculatedPremium);
        }

        [TestMethod]
        public void PersonalDetailCannotBeNull()
        {
            try
            {
                PersonalDetail personalDetail = null;

                var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            }
            catch (BusinessException be)
            {
                Assert.AreEqual(be.Message, "Personal Details are required");
            }
            catch (Exception ex)
            {
                Assert.Fail("Unexpected exception of type {0} caught: {1}", ex.GetType(), ex.Message);
            }
        }

        [TestMethod]
        public void NameIsRequired()
        {
            try
            {
                var personalDetail = new PersonalDetail()
                {
                    Name = "",
                    Age = 10,
                    DateOfBirth = new DateTime(2011, 1, 1),
                    OccupationId = Profession.Author,
                    DeathSumInsured = 50000000
                };

                var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            }
            catch (BusinessException be)
            {
                Assert.AreEqual(be.Message, "Name is required");
            }
            catch (Exception ex)
            {
                Assert.Fail("Unexpected exception of type {0} caught: {1}", ex.GetType(), ex.Message);
            }
        }

        [TestMethod]
        public void NameIsTooLong()
        {
            try
            {
                var personalDetail = new PersonalDetail()
                {
                    Name = "012345678901234567890123456789012345678901234567890",//51 characters
                    Age = 10,
                    DateOfBirth = new DateTime(2011, 1, 1),
                    OccupationId = Profession.Author,
                    DeathSumInsured = 50000000
                };

                var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            }
            catch (BusinessException be)
            {
                Assert.AreEqual(be.Message, "Name is too long");
            }
            catch (Exception ex)
            {
                Assert.Fail("Unexpected exception of type {0} caught: {1}", ex.GetType(), ex.Message);
            }
        }

        [TestMethod]
        public void AgeShouldBeUpto80()
        {
            try
            {
                var personalDetail = new PersonalDetail()
                {
                    Name = "Vijay",
                    Age = 82,
                    DateOfBirth = new DateTime(1939, 1, 1),
                    OccupationId = Profession.Author,
                    DeathSumInsured = 50000000
                };
                var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            }
            catch (BusinessException be)
            {
                Assert.AreEqual(be.Message, "Age should be upto 80");
            }
            catch (Exception ex)
            {
                Assert.Fail("Unexpected exception of type {0} caught: {1}", ex.GetType(), ex.Message);
            }
        }

        [TestMethod]
        public void IncorrectBirthdateOrEnteredAge()
        {
            try
            {
                var personalDetail = new PersonalDetail()
                {
                    Name = "Vijay",
                    Age = 70,
                    DateOfBirth = new DateTime(2011, 1, 1),
                    OccupationId = Profession.Author,
                    DeathSumInsured = 50000000
                };
                var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            }
            catch (BusinessException be)
            {
                Assert.AreEqual(be.Message, "Incorrect birthdate or entered age");
            }
            catch (Exception ex)
            {
                Assert.Fail("Unexpected exception of type {0} caught: {1}", ex.GetType(), ex.Message);
            }
        }

        [TestMethod]
        public void InvalidDeathSum()
        {
            try
            {
                var personalDetail = new PersonalDetail()
                {
                    Name = "Vijay",
                    Age = 10,
                    DateOfBirth = new DateTime(2011, 1, 1),
                    OccupationId = Profession.Author,
                    DeathSumInsured = 0
                };
                var calculatedPremium = premiumLogic.CalculateMontlyPremium(personalDetail);

            }
            catch (BusinessException be)
            {
                Assert.AreEqual(be.Message, "Invalid death sum");
            }
            catch (Exception ex)
            {
                Assert.Fail("Unexpected exception of type {0} caught: {1}", ex.GetType(), ex.Message);
            }
        }
    }
}
