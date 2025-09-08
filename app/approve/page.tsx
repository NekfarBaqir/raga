"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail } from "lucide-react";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const bars = [
  {
    animationDelay: "-1.2s",
    transform: "rotate(.0001deg) translate(146%)",
  },
  {
    animationDelay: "-1.1s",
    transform: "rotate(30deg) translate(146%)",
  },
  {
    animationDelay: "-1.0s",
    transform: "rotate(60deg) translate(146%)",
  },
  {
    animationDelay: "-0.9s",
    transform: "rotate(90deg) translate(146%)",
  },
  {
    animationDelay: "-0.8s",
    transform: "rotate(120deg) translate(146%)",
  },
  {
    animationDelay: "-0.7s",
    transform: "rotate(150deg) translate(146%)",
  },
  {
    animationDelay: "-0.6s",
    transform: "rotate(180deg) translate(146%)",
  },
  {
    animationDelay: "-0.5s",
    transform: "rotate(210deg) translate(146%)",
  },
  {
    animationDelay: "-0.4s",
    transform: "rotate(240deg) translate(146%)",
  },
  {
    animationDelay: "-0.3s",
    transform: "rotate(270deg) translate(146%)",
  },
  {
    animationDelay: "-0.2s",
    transform: "rotate(300deg) translate(146%)",
  },
  {
    animationDelay: "-0.1s",
    transform: "rotate(330deg) translate(146%)",
  },
];

const Spinner = ({ size = 20, color = "#8f8f8f" }: SpinnerProps) => {
  return (
    <div style={{ width: size, height: size }}>
      <style jsx>
        {`
          @keyframes spin {
            0% {
              opacity: 0.15;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        className="relative top-1/2 left-1/2"
        style={{ width: size, height: size }}
      >
        {bars.map((item) => (
          <div
            key={item.transform}
            className="absolute h-[8%] w-[24%] -left-[10%] -top-[3.9%] rounded-[5px]"
            style={{
              backgroundColor: color,
              animation: "spin 1.2s linear infinite",
              ...item,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const sizes = [
  {
    tiny: "px-1.5 h-6 text-sm",
    small: "px-1.5 h-8 text-sm",
    medium: "px-2.5 h-10 text-sm",
    large: "px-3.5 h-12 text-base",
  },
  {
    tiny: "w-6 h-6 text-sm",
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base",
  },
];

const types = {
  primary:
    "bg-[#171717] dark:bg-[#ededed] hover:bg-[#383838] dark:hover:bg-[#cccccc] text-white dark:text-[#0a0a0a] fill-white dark:fill-[#0a0a0a]",
  secondary:
    "bg-white dark:bg-[#171717] hover:bg-[#00000014] dark:hover:bg-[#ffffff17] text-[#171717] dark:text-[#ededed] fill-[#171717] dark:fill-[#ededed] border border-[#00000014] dark:border-[#ffffff24]",
  tertiary:
    "bg-white dark:bg-[#171717] hover:bg-[#00000014] dark:hover:bg-[#ffffff17] text-[#171717] dark:text-[#ededed] fill-[#171717] dark:fill-[#ededed]",
  error:
    "bg-[#ea001d] dark:bg-[#e2162a] hover:bg-[#ae292f] dark:hover:bg-[#ff565f] text-[#f5f5f5] dark:text-white fill-[#f5f5f5] dark:fill-white",
  warning: "bg-[#ff9300] hover:bg-[#d27504] text-[#0a0a0a] fill-[#0a0a0a]",
};

const shapes = {
  square: {
    tiny: "rounded",
    small: "rounded-md",
    medium: "rounded-md",
    large: "rounded-lg",
  },
  circle: {
    tiny: "rounded-[100%]",
    small: "rounded-[100%]",
    medium: "rounded-[100%]",
    large: "rounded-[100%]",
  },
  rounded: {
    tiny: "rounded-[100px]",
    small: "rounded-[100px]",
    medium: "rounded-[100px]",
    large: "rounded-[100px]",
  },
};

interface CustomButtonProps {
  size?: keyof (typeof sizes)[0];
  type?: keyof typeof types;
  shape?: keyof typeof shapes;
  svgOnly?: boolean;
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  shadow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

const CustomButton = ({
  size = "medium",
  type = "primary",
  shape = "square",
  svgOnly = false,
  children,
  prefix,
  suffix,
  shadow = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  ref,
  ...rest
}: CustomButtonProps) => {
  return (
    <button
      ref={ref}
      type="submit"
      disabled={disabled}
      onClick={onClick}
      tabIndex={0}
      className={`flex justify-center items-center gap-0.5 duration-150 ${
        sizes[+svgOnly][size]
      } ${
        disabled || loading
          ? "bg-[#f2f2f2] dark:bg-[#1a1a1a] text-[#8f8f8f] fill-[#8f8f8f] border border-[#ebebeb] dark:border-[#2e2e2e] cursor-not-allowed"
          : types[type]
      } ${shapes[shape][size]}${
        shadow
          ? " shadow-[0_0_0_1px_#00000014,_0px_2px_2px_#0000000a] border-none"
          : ""
      }${
        fullWidth ? " w-100%" : ""
      } focus:shadow-[0_0_0_2px_hsla(0,0%,100%,1),0_0_0_4px_oklch(57.61% 0.2508 258.23)]`}
      {...rest}
    >
      {loading ? <Spinner size={size === "large" ? 24 : 16} /> : prefix}
      <span
        className={`overflow-hidden whitespace-nowrap overflow-ellipsis font-sans${
          size === "tiny" ? "" : " px-1.5"
        }`}
      >
        {children}
      </span>
      {!loading && suffix}
    </button>
  );
};

interface AccessPendingPageProps {
  adminEmail?: string;
  onCheckAccess?: () => void;
}

const AccessPendingPage = ({
  adminEmail = "ragaentop@gmail.com",
}: AccessPendingPageProps) => {
  const [isChecking, setIsChecking] = React.useState(false);

  const handleCheckAccess = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      window.location.href = "/auth/logout";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Access Pending</h1>
          <p className="text-muted-foreground text-lg">
            Your account does not have access yet. Please contact the admin to
            request approval.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground">
            Contact Administrator
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href={`mailto:${adminEmail}`}
              className="text-foreground hover:underline"
            >
              {adminEmail}
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center cursor-pointer">
            <CustomButton
              type="primary"
              size="large"
              fullWidth
              loading={isChecking}
              onClick={handleCheckAccess}
              prefix={
                !isChecking ? <RefreshCw className="w-4 h-4" /> : undefined
              }
            >
              {isChecking ? "Checking Access..." : "Check Access"}
            </CustomButton>
          </div>
          <p className="text-xs text-muted-foreground">
            Clicking this button will log you out. Try accessing dashboard
            againt to check your access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AccessPendingDemo() {
  return <AccessPendingPage />;
}
