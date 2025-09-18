import React from "react";

const page = ({ params: { age } }: { params: { age: string } }) => {
  const AgeComponent = React.lazy(() => import(`@/components/age/Age${age}`));

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AgeComponent />
    </React.Suspense>
  );
};

export default page;
