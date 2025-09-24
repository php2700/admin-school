// @ts-nocheck
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios from "axios";
import { useNavigate } from "react-router";

export default function SignInForm() {
      const navigate = useNavigate();
      const [showPassword, setShowPassword] = useState(false);
      const [isChecked, setIsChecked] = useState(false);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState();

      const handleSubmit = async (e: any) => {
            try {
                  e.preventDefault();

                  if (!email) {
                  } else if (!password) {
                  }

                  const loginData = { email, password };
                  const response = await axios.post(
                        `${import.meta.env.VITE_APP_URL}api/admin/login`,
                        loginData
                  );

                  localStorage.setItem(
                        "shriRamSchoolToken",
                        response?.data?.data?.token
                  );
                  setError("");
                  navigate("/home");
            } catch (error) {
                  setError(error?.response?.data?.message);
            }
      };

      return (
            <div className="flex flex-col flex-1">
                  <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                              <div className="mb-5 sm:mb-8">
                                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                          Sign In
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                          Enter your email and password to sign
                                          in!
                                    </p>
                              </div>
                              <div>
                                    <form onSubmit={handleSubmit}>
                                          <div className="space-y-6">
                                                <div>
                                                      <Label>
                                                            Email{" "}
                                                            <span className="text-error-500">
                                                                  *
                                                            </span>{" "}
                                                      </Label>
                                                      <Input
                                                            value={email}
                                                            onChange={(e) =>
                                                                  setEmail(
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            placeholder="info@gmail.com"
                                                      />
                                                </div>
                                                <div>
                                                      <Label>
                                                            Password{" "}
                                                            <span className="text-error-500">
                                                                  *
                                                            </span>{" "}
                                                      </Label>
                                                      <div className="relative">
                                                            <Input
                                                                  onChange={(
                                                                        e
                                                                  ) =>
                                                                        setPassword(
                                                                              e
                                                                                    .target
                                                                                    .value
                                                                        )
                                                                  }
                                                                  value={
                                                                        password
                                                                  }
                                                                  type={
                                                                        showPassword
                                                                              ? "text"
                                                                              : "password"
                                                                  }
                                                                  placeholder="Enter your password"
                                                            />
                                                            <span
                                                                  onClick={() =>
                                                                        setShowPassword(
                                                                              !showPassword
                                                                        )
                                                                  }
                                                                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                            >
                                                                  {showPassword ? (
                                                                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                                  ) : (
                                                                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                                  )}
                                                            </span>
                                                      </div>
                                                </div>
                                                {error && (
                                                      <p className="my-2 text-sm text-red-500">
                                                            {error}
                                                      </p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                  checked={
                                                                        isChecked
                                                                  }
                                                                  onChange={
                                                                        setIsChecked
                                                                  }
                                                            />
                                                            <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                                                  Keep me logged
                                                                  in
                                                            </span>
                                                      </div>
                                                </div>
                                                <div>
                                                      <Button
                                                            className="w-full"
                                                            size="sm"
                                                      >
                                                            Sign in
                                                      </Button>
                                                </div>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

