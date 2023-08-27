"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SectionTitle from "@/components/Common/SectionTitle";
import Contact from "@/components/Contact";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { PLAN_CONTRACT, PLAN_SUBSCRIPTION_CONTRACT } from "@/app/constants";
import PlanConteactAbi from "app/abi/Plan.json";
import PlanSubscriptionContractAbi from "app/abi/PlanSubscription.json";
import { useAuth } from "../authProvider";
import { GetUTCTimeNow } from "../utils";

declare var window: any

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const ExplorePage = () => {

  const { currentAccount, setCurrentAccount, disconnectWalletHandler } = useAuth();
  const [allPlans, setAllPlans] = useState<any>(null);

  async function GetAllPlans() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const plansContract = new ethers.Contract(PLAN_CONTRACT, PlanConteactAbi.abi, signer);
    const resp = await plansContract.getAllPlans();
    return resp;
  }

  async function refreshAllPlansList() {
    const resp = await GetAllPlans();
    setAllPlans(null);
    var pps = [];
    for (var r in resp) {
      var val = resp[r];
      pps.push({
        "planNumber": val[0],
        "planName": val[1],
        "planPrice": val[3] + " ETH",
        "planDuration": val[5].toString()
      })
      setAllPlans(pps)
    }
  }

  useEffect(() => {
    if (currentAccount) {
      const guPlans = async () => {
        await GetAllPlans();
      };
      guPlans();
      console.log("-========== all plans are: ", allPlans);
    }
  });

  const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  async function CreatePlanSubscription(planNumber: Number, userAddr: String, planName: String, planDuration: string) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const subContract = new ethers.Contract(PLAN_SUBSCRIPTION_CONTRACT, PlanSubscriptionContractAbi.abi, signer);
    const subName = "Subscription for " + planName + ", Addr: " + userAddr;
    const plDur = parseInt(planDuration);
    const t_now = GetUTCTimeNow();
    const invalidAfter = t_now + (plDur * 86400);
    const resp = await subContract.createSubscription(planNumber, subName, "https://bafybeibgjdxuswuowaha4bokcnwowbbhd6gpniplxbn6no6pcs3xqygyni.ipfs.nftstorage.link/", "ipfsHash", userAddr, GetUTCTimeNow(), invalidAfter);
    return resp;
  }

  async function MintPlanSubscription(planNumber: Number, planName: string, planDuration: string) {
    const subOwnerVal = prompt("Please enter Address of User for which you want to mint the subscription:");
    const resp = await CreatePlanSubscription(planNumber, subOwnerVal, planName, planDuration);
    console.log("========= final mint response: ", resp);
    alert(`Transaction submitted. Hash: ${resp.hash}`);
  }

  return (
    <>
      <Breadcrumb
        pageName="Explore Subscriptions"
        description="Explore available Subscriptions built on the Doorway Protocol"
      />

      <div className="flex w-full items-center justify-center mb-20">
        <button onClick={refreshAllPlansList} className="items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {
          allPlans && allPlans.map((uPlan) => (
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



    </>
  );
};

export default ExplorePage;
