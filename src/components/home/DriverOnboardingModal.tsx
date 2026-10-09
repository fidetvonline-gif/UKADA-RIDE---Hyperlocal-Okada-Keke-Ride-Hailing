import React, { useState } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { DriverMode, VehicleType } from '../../types';
import { ASSET_AVATAR_1, ASSET_AVATAR_2 } from '../../data/mockData';
import { UkadaLogo } from '../common/UkadaLogo';
import { CheckCircle2, X, Smartphone, Phone, Bike, ShieldCheck } from 'lucide-react';

interface DriverOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverOnboardingModal: React.FC<DriverOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerDriver } = useUkada();

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('+234 ');
  const [driverMode, setDriverMode] = useState<DriverMode>('app');
  const [vehicleType, setVehicleType] = useState<VehicleType>('okada');
  const [vehicleReg, setVehicleReg] = useState<string>('AKW-');
  const [vehicleModel, setVehicleModel] = useState<string>('Bajaj Boxer 150');
  const [vehicleColor, setVehicleColor] = useState<string>('Black / Red');
  const [serviceZone, setServiceZone] = useState<string>('Ukana Central Zone');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const codePrefix = vehicleType === 'okada' ? 'OK' : 'KK';
    const randomCode = `UKD-${codePrefix}-${Math.floor(100 + Math.random() * 900)}`;

    registerDriver({
      fullName: fullName.trim(),
      phone: phone.trim(),
      photoUrl: driverMode === 'app' ? ASSET_AVATAR_1 : ASSET_AVATAR_2,
      driverCode: randomCode,
      driverMode,
      vehicleType,
      vehicleReg: vehicleReg.trim(),
      vehicleColor: vehicleColor.trim(),
      vehicleModel: vehicleModel.trim(),
      status: 'approved',
      availability: 'online',
      serviceZones: [serviceZone],
      currentLat: 5.2860,
      currentLng: 7.6790,
      lastLocationUpdate: new Date().toISOString(),
      approvedBy: 'Admin Michael Essien (Self-Onboarding)',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-800 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <UkadaLogo size="sm" subtitle="FLEET PARTNER ONBOARDING" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empowering Okada &amp; Keke operators in Ukana, Ikot Ekpene and Essien Udim. Both smartphone owners and basic feature-phone drivers are warmly welcomed.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Driver Onboarding Approved!</h4>
            <p className="text-xs text-slate-300 max-w-sm">
              Your driver profile has been verified and added to the UKADA fleet database. You can now go online in the Driver App or receive manual calls from the control room.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Edidiong Bassey"
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Phone Number (Nigeria) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Driver Operating Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 font-semibold">Operating Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setDriverMode('app')}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    driverMode === 'app'
                      ? 'bg-amber-950/30 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Smartphone (App)</p>
                    <p className="text-[10px] text-slate-400">Live GPS &amp; digital dispatch</p>
                  </div>
                </div>

                <div
                  onClick={() => setDriverMode('phone_only')}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    driverMode === 'phone_only'
                      ? 'bg-blue-950/30 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Basic Phone</p>
                    <p className="text-[10px] text-slate-400">Voice call assisted dispatch</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e: any) => setVehicleType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="okada">Okada (Motorcycle)</option>
                  <option value="keke">Keke (Tricycle)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Vehicle Plate / Registration</label>
                <input
                  type="text"
                  required
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  placeholder="AKW-552-UK"
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Vehicle Make &amp; Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Primary Service Corridor</label>
                <select
                  value={serviceZone}
                  onChange={(e) => setServiceZone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value="Ukana Central Zone">Ukana Central (Poly Campus &amp; Ideh)</option>
                  <option value="Ikot Ekpene Urban Zone">Ikot Ekpene Urban (Plaza &amp; Motor Park)</option>
                  <option value="Essien Udim Corridor">Essien Udim (LGA Secretariat &amp; Obo Annang)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You retain 90% of cash collected. Low 10% platform fee settles weekly.</span>
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98]"
            >
              Submit Driver Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
