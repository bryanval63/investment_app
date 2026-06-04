import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ReactElement } from "react";

type CardContainerProps = {
  cardStyle?: string;
  title: string;
  children: ReactElement;
};

export const CardContainer = ({
  children,
  title,
  cardStyle = "w-full",
}: CardContainerProps) => {
  return (
    <Card className={cardStyle}>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <CardTitle className="text-sm md:text-base">{title}</CardTitle>
          <Separator className="hidden md:block" />
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
