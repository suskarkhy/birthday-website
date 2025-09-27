import React from "react";

const ageComponents = {
  "26": React.lazy(() => import("@/components/age/Age26")),
  "27": React.lazy(() => import("@/components/age/Age27")),
};

const page = ({ params: { age } }: { params: { age: string } }) => {
  const AgeComponent = ageComponents[age as keyof typeof ageComponents];

  const birthdayAge =
    new Date().getFullYear() - new Date("1998-10-26").getFullYear();

  if (!AgeComponent) {
    return (
      <div>
        wtf ur not ${age} years old{" "}
        {Number(age) > birthdayAge ? "yet" : "anymore"}
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center">
          loading pls weit
          <img src="/cat-kiss.gif" alt="kat" />
        </div>
      }
    >
      <AgeComponent />
    </React.Suspense>
  );
};

export default page;
