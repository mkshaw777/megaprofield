import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, Receipt } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface Approval {
  id: number;
  type: 'tour' | 'expense';
  mrName: string;
  date: string;
  details: string;
  amount?: string;
  status: 'pending';
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: 1,
      type: 'tour',
      mrName: 'John Doe',
      date: '2025-10-25',
      details: 'Andheri - Bandra (3 doctors)',
      status: 'pending',
    },
    {
      id: 2,
      type: 'expense',
      mrName: 'Jane Smith',
      date: '2025-10-21',
      details: 'Daily expense - 45 km travelled',
      amount: '₹860',
      status: 'pending',
    },
    {
      id: 3,
      type: 'tour',
      mrName: 'Mike Johnson',
      date: '2025-10-26',
      details: 'Borivali - Kandivali (4 doctors)',
      status: 'pending',
    },
    {
      id: 4,
      type: 'expense',
      mrName: 'Sarah Williams',
      date: '2025-10-21',
      details: 'Daily expense - 38 km travelled + Hotel',
      amount: '₹1,304',
      status: 'pending',
    },
  ]);

  const handleApprove = (id: number) => {
    setApprovals(approvals.filter((a) => a.id !== id));
    toast.success('Approved successfully!');
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.filter((a) => a.id !== id));
    toast.error('Rejected');
  };

  const tourApprovals = approvals.filter((a) => a.type === 'tour');
  const expenseApprovals = approvals.filter((a) => a.type === 'expense');

  return (
    <div>
      {/* Tabs */}
      <div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All ({approvals.length})</TabsTrigger>
            <TabsTrigger value="tour">Tour Plans ({tourApprovals.length})</TabsTrigger>
            <TabsTrigger value="expense">Expenses ({expenseApprovals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {approvals.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No pending approvals</p>
              </div>
            ) : (
              approvals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="tour" className="space-y-3">
            {tourApprovals.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No pending tour plan approvals</p>
              </div>
            ) : (
              tourApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="expense" className="space-y-3">
            {expenseApprovals.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No pending expense approvals</p>
              </div>
            ) : (
              expenseApprovals.map((approval) => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function ApprovalCard({ approval, onApprove, onReject }: ApprovalCardProps) {
  const Icon = approval.type === 'tour' ? Calendar : Receipt;
  const iconColor = approval.type === 'tour' ? '#8B5CF6' : '#F59E0B';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${iconColor}15` }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <h4 className="text-[#1F2937] mb-1">{approval.mrName}</h4>
          <p className="text-sm text-gray-600 mb-1">{approval.details}</p>
          <p className="text-xs text-gray-500">{new Date(approval.date).toLocaleDateString()}</p>
          {approval.amount && (
            <p className="text-sm text-[#1F2937] mt-2">Amount: {approval.amount}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => onReject(approval.id)}
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-50"
        >
          <XCircle size={16} className="mr-2" />
          Reject
        </Button>
        <Button
          onClick={() => onApprove(approval.id)}
          className="bg-[#10B981] hover:bg-green-600"
        >
          <CheckCircle size={16} className="mr-2" />
          Approve
        </Button>
      </div>
    </div>
  );
}
