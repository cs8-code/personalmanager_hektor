import { useState, useEffect } from 'react';
import { Shield, UserPlus, X, Loader2, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'roles' | 'messages'>('roles');
  const [loading, setLoading] = useState(true);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [granting, setGranting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUserRoles();
      fetchContactMessages();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'administrator')
      .maybeSingle();

    if (!error && data) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const fetchUserRoles = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user roles:', error);
      return;
    }

    setUserRoles(data || []);
  };

  const fetchContactMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return;
    }

    setContactMessages(data || []);
  };

  const grantManagerRole = async () => {
    if (!userIdInput.trim()) {
      alert('Please enter a user ID');
      return;
    }

    setGranting(true);
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userIdInput.trim(),
        role: 'manager',
        granted_by: user?.id
      });

    if (error) {
      console.error('Error granting manager role:', error);
      alert(`Failed to grant manager role: ${error.message}`);
    } else {
      alert('Manager role granted successfully');
      setUserIdInput('');
      fetchUserRoles();
    }

    setGranting(false);
    setShowGrantModal(false);
  };

  const revokeRole = async (userId: string, role: string) => {
    if (role === 'administrator') {
      alert('Cannot revoke administrator role');
      return;
    }

    if (!confirm('Are you sure you want to revoke this role?')) return;

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      console.error('Error revoking role:', error);
      alert('Failed to revoke role');
    } else {
      alert('Role revoked successfully');
      fetchUserRoles();
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    } else {
      fetchContactMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have administrator privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-yellow-400 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Administrator Panel</h1>
            </div>
            {activeTab === 'roles' && (
              <button
                onClick={() => setShowGrantModal(true)}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Grant Manager Role
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('roles')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'roles'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                User Roles
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'messages'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Messages
                {contactMessages.filter(m => m.status === 'new').length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contactMessages.filter(m => m.status === 'new').length}
                  </span>
                )}
              </div>
            </button>
          </div>

          {activeTab === 'roles' ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Roles</h2>
                <p className="text-gray-600 mb-6">
                  Grant manager roles to users so they can add, edit, and delete worker entries.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">User ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRoles.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          No users with roles found
                        </td>
                      </tr>
                    ) : (
                      userRoles.map(ur => (
                        <tr key={ur.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900 font-mono text-sm">
                            {ur.user_id}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              ur.role === 'administrator'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ur.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {ur.role === 'manager' ? (
                              <button
                                onClick={() => revokeRole(ur.user_id, ur.role)}
                                className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Revoke
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Cannot revoke</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Messages</h2>
                <p className="text-gray-600 mb-6">
                  View and manage contact form submissions.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No contact messages found
                        </td>
                      </tr>
                    ) : (
                      contactMessages.map(msg => (
                        <tr key={msg.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900 text-sm">
                            {formatDate(msg.created_at)}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {msg.name}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {msg.subject}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              msg.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : msg.status === 'read'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {msg.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedMessage(msg);
                                if (msg.status === 'new') {
                                  updateMessageStatus(msg.id, 'read');
                                }
                              }}
                              className="inline-flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium rounded-lg transition-colors"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Grant Manager Role</h3>
            <p className="text-gray-600 mb-6">
              Enter the User ID (UUID) of the user you want to grant manager role to.
              You can find the User ID in their profile or from the authentication logs.
            </p>
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="Enter User ID (UUID)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none mb-6"
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowGrantModal(false);
                  setUserIdInput('');
                }}
                disabled={granting}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={grantManagerRole}
                disabled={granting || !userIdInput.trim()}
                className="flex-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center"
              >
                {granting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Granting...
                  </>
                ) : (
                  'Grant Role'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h3>
                <p className="text-sm text-gray-500">{formatDate(selectedMessage.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Von:</span>
                <span className="text-gray-900">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">E-Mail:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-yellow-600 hover:text-yellow-700">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Telefon:</span>
                  <a href={`tel:${selectedMessage.phone}`} className="text-yellow-600 hover:text-yellow-700">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedMessage.status === 'new'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedMessage.status === 'read'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Nachricht:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex gap-3">
              {selectedMessage.status !== 'replied' && (
                <button
                  onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                  className="flex-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg transition-colors"
                >
                  Als beantwortet markieren
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
