"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import Image from "next/image";
import GuyShopping from "@/app/assets/images/guy-shopping-vector.png";
import { Loader2 } from "lucide-react";
import { useSignInMutation } from "@/app/store/apis/AuthApi";
import GoogleIcon from "@/app/assets/icons/google.png";
import FacebookIcon from "@/app/assets/icons/facebook.png";
import TwitterIcon from "@/app/assets/icons/twitter.png";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const SignIn = () => {
  const [signIn, { error, isLoading }] = useSignInMutation();
  console.log("error: ", error);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: InputForm) => {
    try {
      const result = await signIn(formData).unwrap();
      console.log("sign in result =>  ", result);
      console.log("result: ", result);
      router.push("/");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/v1/auth/${provider}`;
    localStorage.removeItem("isLoggedOut");
  };

  return (
    <MainLayout>
      <div className="flex flex-row-reverse justify-between items-center w-full py-[3%] px-[10%]">
        <main className="w-full max-w-[40%] p-[2.5rem] bg-white rounded shadow-sm">
          <h2 className="text-3xl font-medium tracking-wide text-start text-gray-700 mb-6">
            Log in to your account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-center text-red-700 w-full px-4 py-[18px] rounded relative mb-4">
              <span className="block sm:inline">
                {"An unexpected error occurred"}
                {/* {error?.data?.message || "An unexpected error occurred"} */}
              </span>
            </div>
          )}

          <p className="text-[15px] text-gray-800">
            For demo purposes, use: admin@gmail.com as email and password
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 ">
            <Input
              name="email"
              type="text"
              placeholder="Email"
              control={control}
              validation={{ required: "Email is required" }}
              error={errors.email?.message}
              className="py-[18px]"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              control={control}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              error={errors.password?.message}
              className="py-[18px]"
            />

            <Link
              href="/password-reset"
              className="block text-[15px] text-gray-800 hover:underline mb-4"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              className={`flex items-center justify-center w-full mx-auto py-[16px] bg-primary text-white rounded font-medium hover:opacity-90 ${
                isLoading ? "cursor-not-allowed bg-gray-400 text-gray-800" : ""
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={27} />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="flex gap-2 items-center justify-center text-center text-gray-500 pt-6">
            <p>Don&apos;t have an account?</p>
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <p
            className="relative text-center text-gray-500 py-3 before:content-[''] 
              before:absolute before:left-0 before:top-1/2 before:w-[45%] before:h-[1px] before:bg-gray-300 after:content-[''] 
              after:absolute after:right-0 after:top-1/2 after:w-[45%] after:h-[1px] after:bg-gray-300 mb-2"
          >
            or
          </p>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              className="flex justify-center items-center py-3 px-4 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all"
            >
              <Image width={20} height={20} src={GoogleIcon} alt="Google" />
            </button>

            <button
              onClick={() => handleOAuthLogin("facebook")}
              className="flex justify-center items-center py-3 px-4 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all"
            >
              <Image width={20} height={20} src={FacebookIcon} alt="Facebook" />
            </button>

            <button
              onClick={() => handleOAuthLogin("twitter")}
              className="flex justify-center items-center py-3 px-4 hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all"
            >
              <Image width={20} height={20} src={TwitterIcon} alt="X" />
            </button>
          </div>
        </main>
        <Image
          src={GuyShopping}
          alt="Girl Shopping"
          className="object-cover w-[550px]"
        />
      </div>
    </MainLayout>
  );
};

export default SignIn;
