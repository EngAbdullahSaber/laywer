const regionOptions = [
  { value: "for test 1", label: "For test 1" },
  { value: "for test 2", label: "For test 2" },
  { value: "for test 3", label: "For test 3" },
];

//!

export const requiredFieldsVendors = [
  { type: "input", name: "Property Name" },
  { type: "input", name: "Operating System" },
  { type: "select", name: "Occasion Type", data: regionOptions },
  { type: "select", name: "Location", data: regionOptions },
  { type: "input", name: "Overall Revenu" },
  { type: "date", name: "Join Date" },
];
export const requiredFieldsUsers = [

  { type: "select", name: "User", data: regionOptions },
  { type: "input", name: "Email" },
  { type: "textarea", name: "Message" },
];