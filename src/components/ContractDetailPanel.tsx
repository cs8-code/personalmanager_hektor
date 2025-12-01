import { X, MapPin, Calendar, Users, Mail, Phone, Building2, MapPinned, FileText } from 'lucide-react';
import { Contract } from '../types/contract.types';

interface ContractDetailPanelProps {
  contract: Contract;
  onClose: () => void;
}

export default function ContractDetailPanel({ contract, onClose }: ContractDetailPanelProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="hidden lg:block w-full lg:w-1/2 sticky top-24 h-fit">
      <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8 max-h-[calc(100vh-8rem)] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{contract.company_name}</h2>
              {contract.contact_name && (
                <p className="text-lg text-yellow-600 font-semibold mb-2">{contract.contact_name}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {contract.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {contract.num_workers} {contract.num_workers === 1 ? 'Mitarbeiter' : 'Mitarbeiter'}
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex gap-4">
            <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
              <div>
                <div className="text-xs text-gray-500">Zeitraum</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Beschreibung</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{contract.description}</p>
        </div>

        {/* Company Details */}
        {contract.company_address && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Firmendetails</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start">
                <Building2 className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Firmenadresse</div>
                  <div className="text-sm text-gray-900 font-medium">{contract.company_address}</div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinned className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Einsatzort</div>
                  <div className="text-sm text-gray-900 font-medium">{contract.location}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontakt</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
            {contract.contact_name && (
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-yellow-600" />
                <span className="font-medium text-sm">{contract.contact_name}</span>
              </div>
            )}
            {contract.contact_email && (
              <a
                href={`mailto:${contract.contact_email}`}
                className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
              >
                <Mail className="w-5 h-5 mr-3 text-yellow-600" />
                <span className="font-medium text-sm">{contract.contact_email}</span>
              </a>
            )}
            {contract.contact_phone && (
              <a
                href={`tel:${contract.contact_phone}`}
                className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
              >
                <Phone className="w-5 h-5 mr-3 text-yellow-600" />
                <span className="font-medium text-sm">{contract.contact_phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Contact Button */}
        <div className="mt-6">
          <a
            href={`mailto:${contract.contact_email}?subject=Interesse an Auftrag: ${contract.company_name}`}
            className="w-full flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Jetzt bewerben
          </a>
        </div>
      </div>
    </div>
  );
}
