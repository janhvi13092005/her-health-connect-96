
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = () => {
  return (
    <div className="h-[500px] flex flex-col items-center justify-center p-6 text-center">
      <MessageSquare className="h-12 w-12 text-doctalk-purple mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Doctor Selected</h3>
      <p className="text-gray-500 max-w-md mb-6">
        Select a doctor from the list to chat or start a call. Our specialists are available 24/7 to address your health concerns.
      </p>
      <div className="text-sm text-gray-400 max-w-sm">
        <p>Browse our list of experienced doctors specializing in women's health, including gynecology, endocrinology, and more.</p>
      </div>
    </div>
  );
};

export default EmptyState;
