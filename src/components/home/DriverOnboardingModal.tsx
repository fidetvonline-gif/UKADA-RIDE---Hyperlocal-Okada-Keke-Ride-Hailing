import React, { useState } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { DriverMode, VehicleType } from '../../types';
import { UkadaLogo } from '../common/UkadaLogo';
import {
  CheckCircle2,
  X,
  Smartphone,
  Phone,
  Bike,
  ShieldCheck,
  Mail,
  MessageSquare,
  Building,
  Camera,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DriverOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverOnboardingModal: React.FC<DriverOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitDriverApplication, setActiveView } = useUkada();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('+234 ');
  const [nin, setNin] = useState<string>('');
  const [driverMode, setDriverMode] = useState<DriverMode>('app');
  const [vehicleType, setVehicleType] = useState<VehicleType>('okada');
  const [vehicleReg, setVehicleReg] = useState<string>('AKW-');
  const [vehicleModel, setVehicleModel] = useState<string>('Bajaj Boxer 150cc');
  const [vehicleColor, setVehicleColor] = useState<string>('Black / Red');
  const [serviceZone, setServiceZone] = useState<string>('Ukana Central Zone');
  const [guarantorName, setGuarantorName] = useState<string>('');
  const [guarantorPhone, setGuarantorPhone] = useState<string>('+234 ');

  // Facial Liveness Selfie simulation state
  const [isCapturingLiveness, setIsCapturingLiveness] = useState<boolean>(false);
  const [livenessCaptured, setLivenessCaptured] = useState<boolean>(false);

  // Submission & notification simulation state
  const [submittedApp, setSubmittedApp] = useState<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    nin: string;
    vehicleType: VehicleType;
    driverMode: DriverMode;
    vehicleReg: string;
    vehicleModel: string;
    serviceZone: string;
    timestamp: string;
  } | null>(null);

  const [activeNotificationTab, setActiveNotificationTab] = useState<'sms' | 'applicant_email' | 'company_email'>('sms');

  if (!isOpen) return null;

  const handleCaptureLiveness = () => {
    setIsCapturingLiveness(true);
    setTimeout(() => {
      setIsCapturingLiveness(false);
      setLivenessCaptured(true);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !nin.trim()) return;

    const appId = `UKD-APP-${Math.floor(1000 + Math.random() * 9000)}`;

    submitDriverApplication({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      nin: nin.trim(),
      vehicleType,
      driverMode,
      vehicleReg: vehicleReg.trim() || 'AKW-PENDING',
      vehicleModel: vehicleModel.trim(),
      serviceZone,
      livenessVerified: livenessCaptured,
    });

    setSubmittedApp({
      id: appId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      nin: nin.trim(),
      vehicleType,
      driverMode,
      vehicleReg: vehicleReg.trim() || 'AKW-PENDING',
      vehicleModel: vehicleModel.trim(),
      serviceZone,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleGoToAdminVerification = () => {
    onClose();
    setActiveView('admin');
  };

  const handleResetAndClose = () => {
    setSubmittedApp(null);
    setFullName('');
    setEmail('');
    setPhone('+234 ');
    setNin('');
    setLivenessCaptured(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 relative max-h-[92vh] overflow-y-auto my-auto">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-800 pb-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <UkadaLogo size="sm" subtitle="DRIVER RECRUITMENT &amp; ONBOARDING" />
          </div>
          <p className="text-xs text-slate-400">
            {submittedApp
              ? 'Application submitted! Review instant multi-channel notification transmissions below.'
              : 'Official driver onboarding portal for Ukana, Ikot Ekpene, and Essien Udim commercial transit.'}
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUBMITTED SUCCESS VIEW WITH 3 INTERACTIVE NOTIFICATIONS       */}
        {/* ------------------------------------------------------------- */}
        {submittedApp ? (
          <div className="flex flex-col gap-5 py-2">
            {/* Top Success Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Application Received Successfully!</h4>
                  <p className="text-xs text-slate-300">
                    Application ID: <span className="font-mono text-emerald-300 font-bold">{submittedApp.id}</span> &middot; Status:{' '}
                    <span className="text-amber-400 font-semibold">Pending Admin Review</span>
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 font-bold">
                SMS &amp; Email Dispatched
              </span>
            </div>

            {/* Notification Tabs Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Multi-Channel Notification Deliveries (Instant Simulation):
                </span>
                <span className="text-[10px] text-slate-500">Live preview of automated alerts</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveNotificationTab('sms')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeNotificationTab === 'sms'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="truncate">1. Driver SMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNotificationTab('applicant_email')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeNotificationTab === 'applicant_email'
                      ? 'bg-blue-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">2. Applicant Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNotificationTab('company_email')}
                  className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeNotificationTab === 'company_email'
                      ? 'bg-purple-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span className="truncate">3. Company Alert</span>
                </button>
              </div>
            </div>

            {/* TAB 1: DRIVER SMS MESSAGE VIEW */}
            {activeNotificationTab === 'sms' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">SMS Notification (Delivered)</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    To: {submittedApp.phone} &middot; {submittedApp.timestamp}
                  </span>
                </div>

                {/* SMS Bubble */}
                <div className="max-w-md bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                    <span>UKADA-FLEET ALERT</span>
                  </div>
                  <p>
                    Hello <strong>{submittedApp.fullName}</strong>, your driver onboarding application (Ref:{' '}
                    <span className="font-mono text-amber-300 font-bold">{submittedApp.id}</span>) has been received
                    successfully. Our verification team is validating your NIN ({submittedApp.nin}) and vehicle
                    credentials. An onboarding officer will contact you within 24 hours. Welcome to UKADA!
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  * Applicant received this direct SMS notification on their mobile phone immediately upon form submission.
                </p>
              </div>
            )}

            {/* TAB 2: APPLICANT CONFIRMATION EMAIL VIEW */}
            {activeNotificationTab === 'applicant_email' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-bold text-white">Welcome Email (Sent to Applicant)</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">To: {submittedApp.email}</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs flex flex-col gap-3 text-slate-300">
                  <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white text-sm">
                        Welcome to UKADA Fleet Family – Application Received
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        From: UKADA Fleet Operations &lt;careers@ukada-ride.ng&gt;
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{submittedApp.timestamp}</span>
                  </div>

                  <p>Dear {submittedApp.fullName},</p>
                  <p>
                    Thank you for applying to drive with UKADA. We have received your onboarding registration for{' '}
                    <strong className="text-amber-400 uppercase">{submittedApp.vehicleType}</strong> (
                    {submittedApp.vehicleModel}).
                  </p>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                    <p>&bull; Application Ref: {submittedApp.id}</p>
                    <p>&bull; Submitted NIN: {submittedApp.nin}</p>
                    <p>&bull; Vehicle Plate: {submittedApp.vehicleReg}</p>
                    <p>&bull; Operating Mode: {submittedApp.driverMode === 'app' ? 'Smartphone (App)' : 'Basic Phone'}</p>
                    <p>&bull; Rate Guarantee: 90% Driver Take-Home (10% platform fee)</p>
                  </div>

                  <p>
                    Our administrative team is cross-checking your credentials against the NIMC verification database.
                    Once approved, your driver profile will go live on the fleet map and you will receive your official
                    safety decal package.
                  </p>
                  <p className="text-slate-400">Warm regards,<br />UKADA Fleet Management Team, Akwa Ibom</p>
                </div>
              </div>
            )}

            {/* TAB 3: COMPANY INTERNAL ALERT EMAIL VIEW */}
            {activeNotificationTab === 'company_email' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="font-bold text-white">Operations Alert (Sent to UKADA Company)</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    To: operations@ukada-ride.ng, superadmin@ukada-ride.ng
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs flex flex-col gap-3 text-slate-300">
                  <div className="border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                        ACTION REQUIRED
                      </span>
                      <p className="font-bold text-white text-sm">
                        New Driver Registration: {submittedApp.fullName} ({submittedApp.vehicleType.toUpperCase()})
                      </p>
                    </div>
                  </div>

                  <p>
                    A new driver application has been filed on the UKADA platform. Details are summarized below:
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                    <div><span className="text-slate-400">Applicant:</span> {submittedApp.fullName}</div>
                    <div><span className="text-slate-400">Phone:</span> {submittedApp.phone}</div>
                    <div><span className="text-slate-400">Email:</span> {submittedApp.email}</div>
                    <div><span className="text-slate-400">NIN:</span> <span className="font-mono text-amber-300">{submittedApp.nin}</span></div>
                    <div><span className="text-slate-400">Vehicle:</span> {submittedApp.vehicleModel} ({submittedApp.vehicleReg})</div>
                    <div><span className="text-slate-400">Corridor:</span> {submittedApp.serviceZone}</div>
                  </div>

                  <p className="text-amber-400 font-semibold">
                    &rarr; The application is now pending under the Admin Dashboard &gt; "Driver Verification" tab for
                    document review, NIMC check, and final approval/rejection.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Admin & Navigation Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleGoToAdminVerification}
                className="w-full sm:w-auto px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Admin Dashboard to Verify Driver</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* INITIAL APPLICATION FORM VIEW                                 */
          /* ------------------------------------------------------------- */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Edidiong Bassey Akpan"
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. edidiong.bassey@gmail.com"
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
                  placeholder="+234 802 345 6789"
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">National Identity Number (NIN) *</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                  placeholder="11-digit NIN (e.g. 48291048291)"
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500">
                  {nin.length}/11 digits entered &middot; Verified via secure NIMC link
                </span>
              </div>
            </div>

            {/* Operating Mode Selector */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-slate-300 font-semibold">Driver Operating Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => setDriverMode('app')}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    driverMode === 'app'
                      ? 'bg-amber-950/30 border-amber-500 text-white ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Smartphone (App Driver)</p>
                    <p className="text-[10px] text-slate-400">Live GPS telemetry &amp; in-app voice</p>
                  </div>
                </div>

                <div
                  onClick={() => setDriverMode('phone_only')}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    driverMode === 'phone_only'
                      ? 'bg-blue-950/30 border-blue-500 text-white ring-1 ring-blue-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Basic Feature Phone</p>
                    <p className="text-[10px] text-slate-400">Assisted voice call dispatch desk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Category & Registration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e: any) => {
                    const vt = e.target.value as VehicleType;
                    setVehicleType(vt);
                    setVehicleModel(vt === 'okada' ? 'Bajaj Boxer 150cc' : 'TVS King Deluxe 200cc');
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="okada">Okada (Motorcycle 150cc)</option>
                  <option value="keke">Keke (Commercial Tricycle 200cc)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Vehicle Plate / Registration Number</label>
                <input
                  type="text"
                  required
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  placeholder="e.g. AKW-782-UK"
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Make / Model & Corridor */}
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
                  <option value="Ukana Central Zone">Ukana Central (Poly Campus &amp; Market)</option>
                  <option value="Ikot Ekpene Urban Zone">Ikot Ekpene Urban (Plaza &amp; Motor Park)</option>
                  <option value="Essien Udim Corridor">Essien Udim (LGA Secretariat &amp; Obo Annang)</option>
                </select>
              </div>
            </div>

            {/* Biometric Liveness Selfie Simulation */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">Facial Liveness &amp; Selfie Check</span>
                </div>
                {livenessCaptured && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Biometrics Captured
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-slate-400">
                  Required for passenger safety and instant verification in the Admin Dashboard.
                </p>
                <button
                  type="button"
                  onClick={handleCaptureLiveness}
                  disabled={isCapturingLiveness}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    livenessCaptured
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {isCapturingLiveness
                    ? 'Scanning...'
                    : livenessCaptured
                    ? 'Retake Selfie'
                    : 'Capture Selfie'}
                </button>
              </div>
            </div>

            {/* Commission Policy Reminder */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                By submitting, you agree to UKADA's 90% Driver Share policy. Automated SMS and Email confirmation will
                be dispatched immediately.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-1 w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Driver Application</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
