'use client';
import { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

import { ethers } from "ethers";
import { PLAN_CONTRACT } from "@/app/constants";
import PlanConteactAbi from "app/abi/Plan.json";
import { useAuth } from "@/app/authProvider";
import { GetUTCTimeNow } from "@/app/utils";

declare var window: any

const Plan = (props: any) => {

  const { currentAccount, setCurrentAccount, disconnectWalletHandler } = useAuth();

  const [formData, setFormData] = useState({
    planName: "",
    planPrice: 0.0,
    planDuration: 0
  });

  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }

  async function CreatePlanContarctCall(planName: string, planPrice: any, planDuration: any) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const plansContract = new ethers.Contract(PLAN_CONTRACT, PlanConteactAbi.abi, signer);
    const planValue = ethers.parseEther(planPrice);
    const resp = await plansContract.createPlan(planName, "image", planPrice, planValue, planDuration, "ipfsHash", GetUTCTimeNow(), true);
    return resp;
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    console.log("====== form is: ", formData);
    const resp = await CreatePlanContarctCall(formData.planName, formData.planPrice, formData.planDuration);
    console.log("====== Create Plan Contract Response: ", resp);
    alert(`Transaction submitted. Hash: ${resp.hash}`);
  }

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28" >

      <Breadcrumb
        pageName="Create a Subscription Plan"
        description="Create a Business Plan to allow your users to mint their own Subscription NFTs. "
      />

      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-12/12 xl:w-12/12">
            <div
              className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s
              "
            >
              {/* <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Need Help? Open a Ticket
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Our support team will get back to you ASAP via email.
              </p> */}
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md lg">
                    <div className="mb-8">
                      <label
                        htmlFor="planName"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="planName"
                        placeholder="Enter your Business Name"
                        onChange={handleInput}
                        required
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      // value={ }
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="planPrice"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Plan Price (in ETH)
                      </label>
                      <input
                        type="text"
                        name="planPrice"
                        placeholder="Enter your Plan Price(in ETH)"
                        onChange={handleInput}
                        required
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      // value={ }
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="planDuration"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Plan Duration (in days)
                      </label>
                      <input
                        type="number"
                        name="planDuration"
                        placeholder="Enter your Plan Duration (in days)"
                        onChange={handleInput} required className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      // value={ }
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button type="submit" className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                      Create your Plan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Plan;
