import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DataItem {
  isActive: boolean;
}

const data: DataItem[] = [];

const CaregiverDashboard: React.FC = () => {
  return (
    <div>
      <Tabs defaultValue="schedule">
        <TabsContent value="schedule">
          <div>
            <Card>
              <CardContent>
                <div>
                  {data.map((item, index) => (
                    <div key={index}>
                      {item.isActive && (
                        <div>
                          <div>
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-[#006D77] hover:bg-[#00585F]"
                            >
                              Schedule
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaregiverDashboard;
