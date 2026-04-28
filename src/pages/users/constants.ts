export interface CompleteUserProfiles {
  success: boolean;
  data: UserProfile[];
  blockedUsers: any[];
  reportedUsers: ReportedUser[];
}

export interface UserProfile {
  id: number;
  uid: string | null;
  userStatus: boolean;
  fcmToken: string | null;
  userId: string;
  planId: string | null;
  email: string;
  otp: string | null;
  password: string;
  usertype: "Standard" | "Gold" | "Platinum" | "Diamond";
  isVerified: boolean;
  isPersonalFormFilled: boolean;
  isQualificationFormFilled: boolean;
  isLocationFormFilled: boolean;
  isOtherFormFilled: boolean;
  isImageFormFilled: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  personalDetails: PersonalDetail[];
  qualificationDetails: QualificationDetail[];
  locationDetails: LocationDetail[];
  otherDetails: OtherDetail[];
  imageUpload: ImageUpload[];
  documents: Document[];
  subscriptions: Subscription[];
  FavoritingProfiles: any[];
  SentConnections: SentConnection[];
  recommendations: Recommendation[];
}

export interface PersonalDetail {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  contactNumber: string;
  maritalStatus: string;
  numberOfChildren: number;
  aboutYourSelf: string;
  createdAt: string;
  updatedAt: string;
}

export interface QualificationDetail {
  id: number;
  userId: string;
  qualification: string;
  currentWorkingStatus: string;
  occupation: string;
  income: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationDetail {
  id: number;
  userId: string;
  country: string;
  state: string;
  currentLocation: string;
  cityOfResidence: string | null;
  nationality: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtherDetail {
  id: number;
  userId: string;
  caste: string;
  community: string;
  subCommunity: string;
  dateOfBirth: string;
  timeOfBirth: string;
  religion: string;
  placeOfBirth: string;
  gotra: string | null;
  motherTongue: string | null;
  height: string | null;
  weight: string | null;
  bodyType: string | null;
  language: string | null;
  smokingHabbit: string | null;
  drinkingHabbit: string | null;
  diet: string | null;
  complexion: string | null;
  fatherOccupation: string | null;
  motherOccupation: string | null;
  numberOfSiblings: string;
  livingWithFamily: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageUpload {
  id: number;
  userId: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: number;
  userId: string;
  documentType: string;
  documentFrontUrl: string;
  documentBackUrl: string;
  isVerified: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: number;
  orderId: string;
  userId: string;
  planId: string;
  paymentSucessId: string;
  deviceType: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  plans: Plan;
}

export interface Plan {
  planId: string;
  planName: string;
  planType: string;
  featureList: string[];
  price: string;
  durationInMonths: number;
  razorpayPriceId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentConnection {
  id: number;
  connectionId: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Receiver: Receiver;
}

export interface Receiver {
  id: number;
  uid: string;
  userStatus: boolean;
  fcmToken: string;
  userId: string;
  planId: string | null;
  email: string;
  otp: string | null;
  password: string;
  usertype: "Standard" | "Gold" | "Platinum" | "Diamond";
  isVerified: boolean;
  isPersonalFormFilled: boolean;
  isQualificationFormFilled: boolean;
  isLocationFormFilled: boolean;
  isOtherFormFilled: boolean;
  isImageFormFilled: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: number;
  uid: string | null;
  userStatus: boolean;
  fcmToken: string | null;
  userId: string;
  email: string;
  usertype: "Standard" | "Gold" | "Platinum" | "Diamond";
  qualification: string | null;
  currentWorkingStatus: string | null;
  occupation: string | null;
  income: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  contactNumber: string | null;
  maritalStatus: string | null;
  numberOfChildren: string | null;
  aboutYourSelf: string | null;
  caste: string | null;
  community: string | null;
  subCommunity: string;
  dateOfBirth: string | null;
  timeOfBirth: string | null;
  religion: string | null;
  placeOfBirth: string | null;
  motherTongue: string | null;
  gotra: string | null;
  height: string | null;
  weight: string | null;
  bodyType: string | null;
  language: string | null;
  smokingHabbit: string | null;
  drinkingHabbit: string | null;
  diet: string | null;
  complexion: string | null;
  fatherOccupation: string | null;
  motherOccupation: string | null;
  siblings: string | null;
  numberOfSiblings: string;
  livingWithFamily: string;
  country: string | null;
  state: string | null;
  currentLocation: string;
  cityOfResidence: string | null;
  nationality: string;
  gender: "Man" | "Woman";
  lookingFor: "Man" | "Woman";
  age: string;
  lookingPartnerAge: string;
  horoscopeMatch: string;
  castReligionMatterOrNot: string;
  interest_and_hobbies: string[];
  image: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportedUser {
  id: number;
  reporterUserId: string;
  reportedUserId: string;
  reason: string[];
  createdAt: string;
}


export {
  CompleteUserProfiles,
  UserProfile,
  PersonalDetail,
  QualificationDetail,
  LocationDetail,
  OtherDetail,
  ImageUpload,
  Document,
  Subscription,
  Plan,
  SentConnection,
  Receiver,
  Recommendation,
  ReportedUser
};
