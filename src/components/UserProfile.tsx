import { User, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function UserProfile() {
  const { user, userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user || !userProfile) {
    return null;
  }

  const displayName = userProfile.name || user.email?.split('@')[0] || 'User';
  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{displayName}</h2>
          <p className="text-sm text-gray-500 mb-2">{user.email}</p>

          <div className="flex items-center gap-2 mb-3">
            <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">
              ID: {user.id}
            </code>
            <button
              onClick={copyUserId}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy User ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {userProfile.phone && (
            <p className="text-sm text-gray-600 mt-3">
              <span className="font-medium">Telefon:</span> {userProfile.phone}
            </p>
          )}

          {userProfile.location && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Standort:</span> {userProfile.location}
            </p>
          )}

          {userProfile.bio && (
            <p className="text-sm text-gray-600 mt-3">{userProfile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
