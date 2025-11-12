import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Mail, Phone, Clock } from 'lucide-react';

interface ContactRequest {
  id: string;
  requester_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requester: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function ContactRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('contact_requests')
        .select('id, requester_id, status, created_at')
        .eq('worker_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      if (!requestsData || requestsData.length === 0) {
        setRequests([]);
        return;
      }

      const requesterIds = requestsData.map(req => req.requester_id);

      const { data: workersData, error: workersError } = await supabase
        .from('workers')
        .select('id, name, email, phone')
        .in('id', requesterIds);

      if (workersError) throw workersError;

      const workersMap = new Map(workersData?.map(w => [w.id, w]) || []);

      const formattedRequests = requestsData.map(req => ({
        id: req.id,
        requester_id: req.requester_id,
        status: req.status as 'pending' | 'accepted' | 'rejected',
        created_at: req.created_at,
        requester: workersMap.get(req.requester_id) || { name: 'Unbekannt', email: '', phone: '' }
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Fehler beim Akzeptieren der Anfrage');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Fehler beim Ablehnen der Anfrage');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kontaktanfragen</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Kontaktanfragen</h2>

      {pendingRequests.length === 0 && acceptedRequests.length === 0 ? (
        <p className="text-gray-600">Keine Kontaktanfragen vorhanden</p>
      ) : (
        <div className="space-y-6">
          {pendingRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Ausstehende Anfragen ({pendingRequests.length})
              </h3>
              <div className="space-y-3">
                {pendingRequests.map(request => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {request.requester?.name || 'Unbekannt'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(request.created_at).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                          title="Akzeptieren"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                          title="Ablehnen"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {acceptedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Akzeptierte Anfragen ({acceptedRequests.length})
              </h3>
              <div className="space-y-3">
                {acceptedRequests.map(request => (
                  <div
                    key={request.id}
                    className="border border-green-200 bg-green-50 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {request.requester?.name || 'Unbekannt'}
                    </h4>
                    <div className="flex flex-col gap-2 text-sm">
                      {request.requester?.email && (
                        <a
                          href={`mailto:${request.requester.email}`}
                          className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {request.requester.email}
                        </a>
                      )}
                      {request.requester?.phone && (
                        <a
                          href={`tel:${request.requester.phone}`}
                          className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {request.requester.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
