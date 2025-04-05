
import { MessageSquare } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="h-[500px] flex flex-col items-center justify-center p-6 text-center">
      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Doctor Selected</h3>
      <p className="text-gray-500">
        Select a doctor from the list to chat or start a call.
      </p>
    </div>
  );
};

export default EmptyState;
