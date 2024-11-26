import React, { useEffect, useState } from 'react'
import './miniout.css'
import { MdOutlineArrowRightAlt } from "react-icons/md";
import axios from 'axios';

// const features = [
//     { id: "1", name: "Custom Domain" },
//     { id: "2", name: "Priority Support" },
//     { id: "3", name: "Advanced Analytics" },
//     { id: "4", name: "Unlimited Storage" },
//     { id: "5", name: "Multi-User Access" },
// ];


const plans = [
    {
      id: "101",
      name: "Basic Plan",
      features: ["1", "3"],
      price: "0",
      recurrence: "month",
    },
    {
      id: "102",
      name: "Pro Plan",
      features: ["1", "2", "3", "4"],
      price: "120",
      recurrence: "month",
    },
    {
      id: "103",
      name: "Enterprise Plan",
      features: ["1", "2", "3", "4", "5"],
      price: "230",
      recurrence: "year",
    },
];

const getPlanById = (plans: { id: string }[], planId: string) => {
    return plans.find(plan => plan.id === planId);
};

const getFeatureNameById = (features: { id: string; name: string }[], id: string): string => {
    const feature = features.find(f => f.id === id);
    return feature ? feature.name : "Feature not found";
};


const filterPlansById = (plans: { id: string }[], planId: string) => {
    return plans.filter(plan => plan.id !== planId);
};

const comparePlanFeatures = (
    plans: { id: string; features: string[] }[],
    features: { id: string; name: string }[],
    planId1: string,
    planId2: string
  ) => {

    console.log("bright: ", planId1, planId2)
    // Find the two plans by their IDs
    const plan1 = plans.find(plan => plan.id === planId1);
    const plan2 = plans.find(plan => plan.id === planId2);

    console.log("plans: ", plan1, " : ", plan2)
  
    if (!plan1 || !plan2) {
      throw new Error("One or both plans not found");
    }
  
    // Convert feature IDs to feature names
    const plan1Features = plan1.features.map(id => {
      const feature = features.find(f => f.id === id);
      return feature ? feature.name : "Unknown Feature";
    });
  
    const plan2Features = plan2.features.map(id => {
      const feature = features.find(f => f.id === id);
      return feature ? feature.name : "Unknown Feature";
    });
  
    // Features present in both plans
    const commonFeatures = plan1Features.filter(feature => plan2Features.includes(feature));
  
    // Features in plan2 but not in plan1
    const extraFeaturesInPlan2 = plan2Features.filter(feature => !plan1Features.includes(feature));
  
    return {
      commonFeatures,
      extraFeaturesInPlan2,
    };
};
  
//   // Example Usage
//   const comparison = comparePlanFeatures(
//     plans,
//     features,
//     "101", // ID of the first plan
//     "103"  // ID of the second plan
//   );
  
//   console.log("Common Features:", comparison.commonFeatures);
//   console.log("Extra Features in Plan 2:", comparison.extraFeaturesInPlan2);
  
  
const activeUserPlan = "102";


const SubcriptionChangeJourney = ({id}: { id?: any }) => {
    console.log("if id: ", id)
    const [features, setDemFeatures] = useState<any[]>([]);
    const [plans, setPackages] = useState<any[]>([]);

    const [step, setStep] = useState<number>(1);
    const [activePlan, setActivePlan] = useState(null);
    const [otherPlan, setOtherPlan] = useState(null);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    useEffect(() => {
        const tripid = getPlanById(plans, id);
        const lumpy = filterPlansById(plans, id);
        console.log("fret: ", tripid, lumpy)
        // @ts-ignore
        setActivePlan(tripid)
        // @ts-ignore
        setOtherPlan(lumpy)
    }, [plans, features]);

    // const comparison = comparePlanFeatures(
    //     plans,
    //     features,
    //     String(id),
    //     "15"
    // );

    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const fetchPackages = async () => {
          try {
            // const [featuresResponse, packagesResponse] = await Promise.all([
            //   axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features`),
            //   axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/packages`),
            // ]);
    
            // setDemFeatures(featuresResponse.data.data || []); // Ensure it’s an array
            // setPackages(packagesResponse.data || []);

            const [featuresResponse, packagesResponse] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/features`),
                axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/packages`),
              ]);
      
              const featuresData = featuresResponse.data.data.map((feature: any) => ({
                id: String(feature.id),
                name: feature.name,
              }));
      
              const plansData = packagesResponse.data.map((plan: any) => ({
                id: String(plan.id),
                name: plan.name,
                price: plan.price,
                features: plan.features.map((id: any) => String(id)),
              }));
      
              setDemFeatures(featuresData);
              setPackages(plansData);
            // setDemFeatures(featuresResponse);
            // setPackages(plansData);
          } catch (error) {
            console.error('Failed to fetch packages', error);
          }
        };
    
        fetchPackages();
      }, []);

      const [nextPackage, setNextPackage] = useState('');
      const naiveDev = (id: string) => setNextPackage(id);
    

  return (
    <React.Fragment>
       {step === 1 && <ChangeInit activePlan={activePlan} otherPlan={otherPlan} nextStep={nextStep} features={features} handleClick={naiveDev}/>}

       {step === 2 && <PlanSummary activePlan={activePlan} otherPlan={otherPlan} nextStep={nextStep} features={features} id={id} nextPackage={nextPackage}/>}

        {step === 3 && <div className="planconfirm">
            <h2>confirm your subscription change</h2>
            <p>are you sure you want to switch to a monthly plan ?</p>
            <div className='gai'>
                <p>
                    <span>new plan:</span> monthly premium
                </p>
                <p>
                    <span>monthly price:</span> 10 €
                </p>
                <p>
                    <span>next billing date:</span> 23/11/2024
                </p>
            </div>

            <p className='max-w-[70%] mx-auto !text-gray-400'>
            note : by switching to a monthly plan, any remaining balance from your
            annual subscription will be adjusted automatically
            </p>

            <div className='flex w-full items-center justify-center gap-2 mt-[20px] mb-[10px]'>
                <span 
                    className='text-white cursor-pointer' 
                    onClick={() => setTermsAccepted(!termsAccepted)}
                    style={{ color: termsAccepted ? '#dd47f7' : 'white' }}
                >
                    [{termsAccepted ? '✔' : '\u00A0\u00A0' }]
                </span>
                <p className='text-[12px] m-0 !text-gray-400' style={{ margin: 0 }}>
                    i agree to the <a href="#">terms and conditions</a> and <a href="#">privacy policy.</a>
                </p>
            </div>

            <div className="dcnbtn text-white flex gap-5 justify-center items-center text-[20px]">
                <button>[ cancel ]</button>
                <button>[ confirm ]</button>
            </div>
        </div>}

        {step === 4 && <div>
            <h2>success !</h2>
            <p>your subscription has been updated to the [ monthly plan ] . <br />
            you will receive an email with all details</p>

            <div className='flex justify-center items-center'>
                <a href="/" className='text-[20px] mx-auto text-white'>
                    [ go to my account ]
                </a>
            </div>
        </div>}

        
        {/* <div className={style.searchInput}>
            <form onSubmit={handleUpdateProfile}>
            <h2>Hello, [{name}]</h2>
            <div className={`${style.subscription} ${style.frmGrp}`}>
                <div className={` ${style.muted} `}>
                Your Current plan is:{' '}
                </div>
                <div className={` ${style.cPlan} `}>
                {hasPackage || 'No Package Selected'}
                </div>
                <div className={` ${style.action} `}>
                {hasPackage ? (
                    <button onClick={handleChangeClick}>[Change]</button>
                ) : (
                    <button onClick={handleChangeClick}>[Select]</button>
                )}
                </div>
            </div>
            <div className={`${style.subscription} ${style.frmGrp}`}>
                <div className={` ${style.muted}`}>
                Method of payment:{' '}
                </div>
                <div className={` ${style.cPlan}`}>
                {selectedPayment}
                </div>
                <div className={` ${style.action} cursor-pointer`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                [Change]
                </div>
                {isDropdownOpen && (
                <div className={style.dropdown}>
                    {paymentTypes.map((payment, index) => (
                    <div key={index} className={style.dropdownItem} onClick={() => handlePaymentChange(payment)}>
                        {payment}
                    </div>
                    ))}
                </div>
                )}
            </div>

            <div
                className={`${style.subscription} ${style.buttonWrapper}`}
            >
                <button
                type="button"
                className={style.submit}
                onClick={handleUpdateProfile}
                >
                [save]
                </button>
            </div>
            </form>
        </div> */}

    </React.Fragment>
  )
}

export const ChangeInit = ({ activePlan, otherPlan, nextStep, prevStep, features, handleClick } : { activePlan: any, otherPlan: any, nextStep?: any, prevStep?: any, features?: any, handleClick?: any  }) => {
    
    const mainClick = (id: string) => {
        nextStep();
        handleClick(id)
    }
    return (
        <div style={{ color: 'white' }}>
            <h2>plans</h2>
            <p>upgrade or downgrade?</p>

            <div className="plannings">
                <div className="myplan flex flex-col justify-center items-center text-center">
                    {activePlan && (
                        <>
                        {/* @ts-ignore */}
                        <h4>{activePlan?.name}</h4>
                        <span className='prices'>
                        {/* @ts-ignore */}
                          {activePlan?.price}
                          {/* @ts-ignore */}
                          <sub>&nbsp;€  per </sub>
                        </span>
                        {/* {activePlan?.recurrence} */}

                        <div className="featurings flex flex-col gap-2">
                            {/* @ts-ignore */}
                            {activePlan.features.map((featuresId: string) => (
                                <span key={featuresId}>{getFeatureNameById(features, featuresId)}</span>
                            ))}
                        </div>
                        </>
                    )}
                    <button disabled className='cursor-pointer'>
                        [ actual plan ]
                    </button>
                </div>

                <div className="otherplans flex gap-[30px] items-center">
                    {
                        // @ts-ignore
                        otherPlan && otherPlan.map((data: any, index: number) => (
                            <div 
                            key={index} 
                            className="actplan">
                                {/* @ts-ignore */}
                                <h4>{data?.name}</h4>
                                <span className='prices mt-[20px] mb-[10px]'>
                                {/* @ts-ignore */}
                                {data?.price}
                                {/* @ts-ignore */}
                                <sub>&nbsp;€  per </sub>
                                {/* {data?.recurrence} */}
                                </span>
                                <div className="featurings flex flex-col gap-2 mt-[20px]">
                                    {/* @ts-ignore */}
                                    {data.features.map((featuresId: string) => (
                                        <span key={featuresId}>{getFeatureNameById(features, featuresId)}</span>
                                    ))}
                                </div>
                                <button onClick={() => mainClick(String(data?.id))} style={{ width: 'fit-content', margin: 'auto' }}>
                                    {/* @ts-ignore */}
                                    {Number(activePlan?.price) > Number(data?.price) ? '[ downgrade ]' : '[ upgrade ]'}
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export const PlanSummary = ({ activePlan, otherPlan, nextStep, prevStep, features, id, nextPackage } : { activePlan: any, otherPlan: any, nextStep?: any, prevStep?: any, features?: any, id?: any, nextPackage?: any }) => {
    const comparison = comparePlanFeatures(
        plans,
        features,
        String(id),
        String(nextPackage)
    );
    return (
        <div className="plansummary">
            <h2>new plan summary</h2>
            <p>this is what you will have following you new plan</p>
            <div className="plansum flex justify-between items-center">
                <div className="main">
                    {/* @ts-ignore */}
                    <h4>{activePlan?.name}</h4> 
                    {/* @ts-ignore */}
                    <span className='prices'>
                    {/* @ts-ignore */}
                        {activePlan?.price}
                        {/* @ts-ignore */}
                        <sub>&nbsp;€  per </sub>
                        {/* {activePlan?.recurrence} */}
                    </span>
                </div>


                <div className="arrowdis relative ">
                    <span className='rounded-full w-[100px]'></span>
                    <span className="head top rounded-full"></span>
                    <span className="head bottom rounded-full"></span>

                </div>

                <div className='flex gap-5'>
                    <div className='available flex flex-col gap-2'>
                        {
                            comparison.commonFeatures.map((feature: string, index: number) => (
                                <div key={index}>
                                    <span>✔</span>
                                    <p>{feature}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className='decline flex flex-col gap-2'>
                        {
                            comparison.extraFeaturesInPlan2.map((feature: string, index: number) => (
                                <div key={index}>
                                    <span>✖</span>
                                    <p>{feature}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
            <div className='flex items-center justify-center my-5'>
                <button onClick={nextStep} className='mx-auto'>[  continue  ]</button>
            </div>
        </div>
    )
}

export const PlanConfirm = () => {
    
}

export default SubcriptionChangeJourney