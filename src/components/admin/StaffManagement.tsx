import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  getAllUsers, 
  addUser, 
  deleteUser, 
  getManagers, 
  generateUsername, 
  generatePassword,
  usernameExists,
  emailExists,
  type StaffUser 
} from '../../utils/authStorage';

interface CredentialsDialogProps {
  user: StaffUser;
  isOpen: boolean;
  onClose: () => void;
}

function CredentialsDialog({ user, isOpen, onClose }: CredentialsDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const copyCredentials = () => {
    const text = `Username: ${user.username}\nPassword: ${user.password}`;
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          toast.success('Credentials copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback to old method
          fallbackCopyTextToClipboard(text);
        });
    } else {
      // Use fallback for older browsers
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
      toast.success('Credentials copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy. Please copy manually.');
    }

    document.body.removeChild(textArea);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>✅ Staff Member Created Successfully!</DialogTitle>
          <DialogDescription>
            Please save these login credentials and share them with the staff member.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-3">
              <strong>{user.name}</strong> has been added to the system.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3">
                <Label className="text-xs text-gray-500">Username</Label>
                <p className="font-mono text-[#2563EB]">{user.username}</p>
              </div>
              <div className="bg-white rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-gray-500">Password</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
                <p className="font-mono text-[#2563EB]">
                  {showPassword ? user.password : '••••••••'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              ⚠️ <strong>Important:</strong> Please share these credentials with the user. They cannot be retrieved later.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyCredentials}
              className="flex-1 bg-[#2563EB] hover:bg-blue-700"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy Credentials
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [managers, setManagers] = useState<StaffUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [credentialsDialog, setCredentialsDialog] = useState<{ isOpen: boolean; user: StaffUser | null }>({
    isOpen: false,
    user: null,
  });
  
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'MR' as 'MR' | 'Manager' | 'Admin',
    manager: '',
    phone: '',
    territory: '',
    username: '',
    password: '',
    autoUsername: true,
    autoPassword: true,
  });

  // Load staff from localStorage
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const allUsers = getAllUsers();
    // Don't show Admin in staff list (keep it separate)
    setStaff(allUsers.filter(u => u.role !== 'Admin'));
    setManagers(getManagers());
  };

  const handleAddStaff = () => {
    // Validation
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.territory) {
      toast.error('Please fill all required fields');
      return;
    }

    // Email validation
    if (emailExists(newStaff.email)) {
      toast.error('Email already exists');
      return;
    }

    // Generate or validate username
    let username = newStaff.username;
    if (newStaff.autoUsername) {
      username = generateUsername(newStaff.email);
    } else {
      if (!username) {
        toast.error('Please enter a username');
        return;
      }
      if (usernameExists(username)) {
        toast.error('Username already exists');
        return;
      }
    }

    // Generate or validate password
    let password = newStaff.password;
    if (newStaff.autoPassword) {
      password = generatePassword();
    } else {
      if (!password || password.length < 4) {
        toast.error('Password must be at least 4 characters');
        return;
      }
    }

    // Add user
    const newUser = addUser({
      name: newStaff.name,
      email: newStaff.email,
      username,
      password,
      role: newStaff.role,
      manager: newStaff.role === 'MR' ? newStaff.manager : undefined,
      phone: newStaff.phone,
      territory: newStaff.territory,
    });

    // Reset form
    setNewStaff({
      name: '',
      email: '',
      role: 'MR',
      manager: '',
      phone: '',
      territory: '',
      username: '',
      password: '',
      autoUsername: true,
      autoPassword: true,
    });

    setIsDialogOpen(false);
    loadStaff();

    // Show credentials dialog
    setCredentialsDialog({
      isOpen: true,
      user: newUser,
    });
  };

  const handleDelete = (id: number) => {
    const userToDelete = staff.find(s => s.id === id);
    if (!userToDelete) return;

    // Prevent deleting default users
    if (['mr', 'manager', 'admin'].includes(userToDelete.username)) {
      toast.error('Cannot delete default demo users');
      return;
    }

    if (confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      deleteUser(id);
      loadStaff();
      toast.success('Staff member deleted');
    }
  };

  const handleGeneratePassword = () => {
    setNewStaff({ ...newStaff, password: generatePassword(), autoPassword: false });
  };

  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#1F2937]">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total Staff: {staff.length} ({staff.filter(s => s.role === 'MR').length} MRs, {managers.length} Managers)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563EB] hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new staff member account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@megapro.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newStaff.role}
                  onValueChange={(value: 'MR' | 'Manager' | 'Admin') => 
                    setNewStaff({ ...newStaff, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MR">Medical Representative</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newStaff.role === 'MR' && (
                <div className="space-y-2">
                  <Label htmlFor="manager">Reporting Manager</Label>
                  <Select
                    value={newStaff.manager}
                    onValueChange={(value) => setNewStaff({ ...newStaff, manager: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="territory">Territory *</Label>
                <Input
                  id="territory"
                  placeholder="e.g., Mumbai Central"
                  value={newStaff.territory}
                  onChange={(e) => setNewStaff({ ...newStaff, territory: e.target.value })}
                />
              </div>

              {/* Username Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label>Login Credentials</Label>
                  <Badge variant="secondary" className="text-xs">
                    {newStaff.autoUsername && newStaff.autoPassword ? 'Auto-generated' : 'Manual'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoUsername"
                        checked={newStaff.autoUsername}
                        onChange={(e) => 
                          setNewStaff({ 
                            ...newStaff, 
                            autoUsername: e.target.checked,
                            username: e.target.checked ? '' : newStaff.username
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="autoUsername" className="text-sm cursor-pointer">
                        Auto-generate username from email
                      </Label>
                    </div>
                    {!newStaff.autoUsername && (
                      <Input
                        placeholder="Enter username"
                        value={newStaff.username}
                        onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                      />
                    )}
                    {newStaff.autoUsername && newStaff.email && (
                      <p className="text-xs text-gray-500">
                        Username will be: <span className="font-mono text-[#2563EB]">
                          {generateUsername(newStaff.email)}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoPassword"
                        checked={newStaff.autoPassword}
                        onChange={(e) => 
                          setNewStaff({ 
                            ...newStaff, 
                            autoPassword: e.target.checked,
                            password: e.target.checked ? '' : newStaff.password
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="autoPassword" className="text-sm cursor-pointer">
                        Auto-generate secure password
                      </Label>
                    </div>
                    {!newStaff.autoPassword && (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter password"
                          value={newStaff.password}
                          onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleGeneratePassword}
                        >
                          <RefreshCw size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button onClick={handleAddStaff} className="w-full bg-[#10B981] hover:bg-green-600">
                Create Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[#1F2937]">{member.name}</h3>
                  <Badge variant={member.role === 'Manager' ? 'default' : 'secondary'}>
                    {member.role}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="text-gray-500">Email:</span> {member.email}
              </p>
              <p className="text-gray-600">
                <span className="text-gray-500">Username:</span> <span className="font-mono text-[#2563EB]">{member.username}</span>
              </p>
              <p className="text-gray-600">
                <span className="text-gray-500">Phone:</span> {member.phone}
              </p>
              <p className="text-gray-600">
                <span className="text-gray-500">Territory:</span> {member.territory}
              </p>
              {member.manager && (
                <p className="text-gray-600">
                  <span className="text-gray-500">Manager:</span> {member.manager}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Credentials Dialog */}
      {credentialsDialog.user && (
        <CredentialsDialog
          user={credentialsDialog.user}
          isOpen={credentialsDialog.isOpen}
          onClose={() => setCredentialsDialog({ isOpen: false, user: null })}
        />
      )}
    </div>
  );
}
