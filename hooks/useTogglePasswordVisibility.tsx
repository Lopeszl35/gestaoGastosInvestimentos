import { useState } from "react";

export const useTogglePasswordVisibility = () => {
  const [isPasswordVisible, setPasswordVisibility] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  return {
    isPasswordVisible,
    togglePasswordVisibility,
  };
};
