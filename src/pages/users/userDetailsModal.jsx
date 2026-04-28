// import React from 'react';

// interface UserModalProps {
//   visible: boolean;
//   onClose: () => void;
//   data: any;
// }

// const UserModal: React.FC<UserModalProps> = ({ visible, onClose, data }) => {
//   if (!visible || !data) return null;

//   const renderSubscription = (subscription: any) => (
//     <div key={subscription.id} className="mb-4 border-b pb-3">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscription Details</h3>
//       <p>Plan: {subscription.plans.planName}</p>
//       <p>Status: {subscription.status}</p>
//       <p>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</p>
//       <p>End Date: {new Date(subscription.endDate).toLocaleDateString()}</p>
//       <p>Price: ₹{subscription.plans.price}</p>
//       <p>Features:</p>
//       <ul className="list-disc pl-5 text-sm text-gray-700">
//         {subscription.plans.featureList.map((feature: string, idx: number) => (
//           <li key={idx}> {feature}</li>
//         ))}
//       </ul>
//     </div>
//   );

//   const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
//     <div className="mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       {children}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg w-[90%] max-w-3xl h-[90%] overflow-y-auto p-6 relative shadow-xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
//           <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
//           >
//             ×
//           </button>
//         </div>

//         {/* Basic Info */}
//         <Section title="Basic Information">
//           <p>Email: {data.email}</p>
//           <p>User Type: {data.usertype}</p>
//           <p>User Status : {data.userStatus ? 'Online' : 'Offline'}</p>
//           <p>Verified: {data.isVerified ? 'Yes' : 'No'}</p>
//           <p>Member Since: {new Date(data.createdAt).toLocaleDateString()}</p>
//         </Section>

//         {/* Personal */}
//         {data.personalDetails?.length > 0 && (
//           <Section title="Personal Details">
//             <p>Name: {data.personalDetails[0].firstName} {data.personalDetails[0].lastName}</p>
//             <p>Display Name: {data.personalDetails[0].displayName}</p>
//             <p>Contact: {data.personalDetails[0].contactNumber}</p>
//             <p>Marital Status: {data.personalDetails[0].maritalStatus}</p>
//             <p>Children: {data.personalDetails[0].numberOfChildren}</p>
//             <p>About: {data.personalDetails[0].aboutYourSelf}</p>
//           </Section>
//         )}

//         {/* Qualification */}
//         {data.qualificationDetails?.length > 0 && (
//           <Section title="Qualification Details">
//             <p>Qualification: {data.qualificationDetails[0].qualification}</p>
//             <p>Occupation: {data.qualificationDetails[0].occupation}</p>
//             <p>Employment: {data.qualificationDetails[0].currentWorkingStatus}</p>
//             <p>Income: {data.qualificationDetails[0].income}</p>
//           </Section>
//         )}

//         {/* Location */}
//         {data.locationDetails?.length > 0 && (
//           <Section title="Location Details">
//             <p>Country: {data.locationDetails[0].country}</p>
//             <p>State: {data.locationDetails[0].state}</p>
//             <p>City: {data.locationDetails[0].cityOfResidence || 'Not specified'}</p>
//             <p>Nationality: {data.locationDetails[0].nationality}</p>
//           </Section>
//         )}

//         {/* Other Details */}
//         {data.otherDetails?.length > 0 && (
//           <Section title="Other Details">
//             <p>Religion: {data.otherDetails[0].religion}</p>
//             <p>Caste: {data.otherDetails[0].caste}</p>
//             <p>Community: {data.otherDetails[0].community}</p>
//             <p>Date of Birth: {data.otherDetails[0].dateOfBirth}</p>
//             <p>Height: {data.otherDetails[0].height || 'Not specified'}</p>
//             <p>Weight: {data.otherDetails[0].weight || 'Not specified'}</p>
//             <p>Diet: {data.otherDetails[0].diet || 'Not specified'}</p>
//           </Section>
//         )}

//         {/* Images */}
//         {data.imageUpload?.length > 0 && (
//           <Section title="Images">
//             <div className="flex flex-wrap gap-4">
//               {data.imageUpload[0].image.map((img: string, idx: number) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`User Image ${idx}`}
//                   className="w-28 h-28 object-cover rounded-md border"
//                 />
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* Subscriptions */}
//         {data.subscriptions?.length > 0 && (
//           <Section title="Subscriptions">
//             {data.subscriptions.map(renderSubscription)}
//           </Section>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserModal;
