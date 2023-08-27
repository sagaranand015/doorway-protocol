"use client";
import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "../Pricing/PricingBox";
import { useAuth } from "@/app/authProvider";

import { ethers } from "ethers";
import { PLAN_CONTRACT, PLAN_SUBSCRIPTION_CONTRACT } from "@/app/constants";
import PlanConteactAbi from "app/abi/Plan.json";
import PlanSubscriptionContractAbi from "app/abi/PlanSubscription.json";
import Plan from "../Plan";
import { GetUTCTimeNow } from "@/app/utils";

declare var window: any

const AllPlans = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  const { currentAccount, setCurrentAccount, disconnectWalletHandler } = useAuth();
  const [userPlans, setUserPlans] = useState<any>(null);

  async function GetAllUserPlans() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const plansContract = new ethers.Contract(PLAN_CONTRACT, PlanConteactAbi.abi, signer);
    const resp = await plansContract.getAllUserPlans(currentAccount);
    return resp;
  }

  async function CreatePlanSubscription(planNumber: Number, userAddr: String, planName: String, planDuration: string) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const subContract = new ethers.Contract(PLAN_SUBSCRIPTION_CONTRACT, PlanSubscriptionContractAbi.abi, signer);
    const subName = "Subscription for " + planName + ", Addr: " + userAddr;
    const plDur = parseInt(planDuration);
    const t_now = GetUTCTimeNow();
    const invalidAfter = t_now + (plDur * 86400);
    const resp = await subContract.createSubscription(planNumber, subName, "randomImage", "ipfsHash", userAddr, GetUTCTimeNow(), invalidAfter);
    return resp;
  }

  useEffect(() => {
    if (currentAccount) {
      const guPlans = async () => {
        const resp = await GetAllUserPlans();
        console.log("========= all user plan responses: ", resp);
      };
      guPlans();
      console.log("-========== user plans are: ", userPlans);
    }
  }, [userPlans]);

  async function refreshUserPlanList() {
    const resp = await GetAllUserPlans();
    setUserPlans(null);
    var pps = [];
    for (var r in resp) {
      var val = resp[r];
      pps.push({
        "planNumber": val[0],
        "planName": val[1],
        "planPrice": val[3] + " ETH",
        "planDuration": val[5].toString()
      })
      setUserPlans(pps)
    }
  }

  async function MintPlanSubscription(planNumber: Number, planName: string, planDuration: string) {
    const subOwnerVal = prompt("Please enter Address of User for which you want to mint the subscription:");
    const resp = await CreatePlanSubscription(planNumber, subOwnerVal, planName, planDuration);
    console.log("========= final mint response: ", resp);
    alert(`Transaction submitted. Hash: ${resp.hash}`);
  }

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="My Subscription Plans"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
          width="665px"
          mb="10px"
        />
        <div className="flex w-full items-center justify-center mb-20">
          <button onClick={refreshUserPlanList} className="items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {
            userPlans && userPlans.map((uPlan) => (
              <>
                <div className="w-full">
                  <div
                    className="wow fadeInUp relative z-10 rounded-md bg-white px-8 py-10 shadow-signUp dark:bg-[#1D2144]"
                    data-wow-delay=".1s"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="price mb-2 text-3xl font-bold text-black dark:text-white">
                        <span className="amount">{uPlan.planPrice}</span>
                      </h3>
                    </div>
                    <p className="mb-5 mb-2 text-xl font-bold text-black dark:text-white">{uPlan.planName}</p>
                    <p className="mb-7 text-base text-body-color">Duration: {uPlan.planDuration} DAYS</p>
                    <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
                      <button onClick={() => MintPlanSubscription(uPlan.planNumber, uPlan.planName, uPlan.planDuration)} className="flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                        Mint a Subscription
                      </button>
                    </div>
                  </div></div>
              </>
            ))
          }
        </div>
      </div>

      <div className="absolute left-0 bottom-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section >
  );
};

export default AllPlans;
