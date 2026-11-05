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
    <Card className={`min-w-0 ${cardStyle}`}>
      <CardHeader className="px-3 lg:px-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-sm lg:text-base">{title}</CardTitle>
          <Separator className="hidden lg:block" />
        </div>
      </CardHeader>
      <CardContent className="px-3 lg:px-6">{children}</CardContent>
    </Card>
  );
};
