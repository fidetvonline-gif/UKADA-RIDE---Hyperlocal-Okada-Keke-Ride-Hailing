import React, { useState } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { DriverOnboardingModal } from '../home/DriverOnboardingModal';
import { ASSET_RIDERS_JOBS_TEAM } from '../../data/mockData';
import { resolveImageUrl } from '../../utils/assetResolver';
import {
  Briefcase,
  Coins,
  CheckCircle2,
  ArrowRight,
  Award,
} from 'lucide-react';

export const DriverJobDetails: React.FC = () => {
  const { setActiveView } = useUkada();
  const [showDriverModal, setShowDriverModal] = useState<boolean>(false);
  const [calcVehicle, setCalcVehicle] = useState<'okada' | 'keke'>('okada');
  const [tripsPerDay, setTripsPerDay] = useState<number>(14);

  const avgTripGross = calcVehicle === 'okada' ? 350 : 600;
  const driverRate = 0.90;
  const dailyEarnings = Math.round(tripsPerDay * avgTripGross * driverRate);
  const weeklyEarnings = dailyEarnings * 6;
  const monthlyEarnings = weeklyEarnings * 4;

  const jobRoles = [
    {
      title: 'Okada Express Rider',
      vehicle: 'Bajaj Boxer 150cc',
      weeklyPay: '₦75,000 – ₦120,000',
      badge: 'High Demand',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      perks: [
        'Keep 90% of every ride fare',
        'Free DOT-certified passenger helmet & safety vest',
        'Flexible hours across city & market junctions',
        'Fuel partner discounts on major transit routes',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer',
    },
    {
      title: 'Keke Route Pilot',
      vehicle: 'Commercial Yellow Tricycle 200cc',
      weeklyPay: '₦95,000 – ₦160,000',
      badge: 'Top Volume',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      perks: [
        'High passenger volume on morning & market routes',
        'Carry 3 passengers per trip for triple ticket revenue',
        'Akwa Ibom transit union compliance badge included',
        'Zero predatory vehicle lease contracts',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer',
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold text-white">Drive & Earn with UKADA</h1>
      <img src={resolveImageUrl(ASSET_RIDERS_JOBS_TEAM)} alt="Driver Team" className="w-full h-64 object-cover rounded-2xl" />
      <p className="text-slate-400">Join our team of verified riders and Keke pilots. Get paid daily, keep 90% of your earnings, and work on your own terms.</p>

      {/* Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
        <h3 className="font-bold text-lg">Earnings Calculator</h3>
        <div className="flex gap-2">
            <button onClick={() => setCalcVehicle('okada')} className={`px-4 py-2 rounded ${calcVehicle === 'okada' ? 'bg-amber-500' : 'bg-slate-800'}`}>Okada</button>
            <button onClick={() => setCalcVehicle('keke')} className={`px-4 py-2 rounded ${calcVehicle === 'keke' ? 'bg-emerald-500' : 'bg-slate-800'}`}>Keke</button>
        </div>
        <input type="range" min="5" max="30" value={tripsPerDay} onChange={(e) => setTripsPerDay(Number(e.target.value))} className="w-full" />
        <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded">Daily: ₦{dailyEarnings}</div>
            <div className="p-4 bg-slate-950 rounded">Weekly: ₦{weeklyEarnings}</div>
            <div className="p-4 bg-slate-950 rounded">Monthly: ₦{monthlyEarnings}</div>
        </div>
      </div>

      {/* Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobRoles.map((role, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-lg">{role.title}</h4>
                <p className="text-sm text-slate-400">{role.vehicle}</p>
                <p className="font-bold text-emerald-400 mt-2">{role.weeklyPay}</p>
                <ul className="mt-4 space-y-2">
                    {role.perks.map((p, i) => <li key={i} className="text-xs text-slate-300">✓ {p}</li>)}
                </ul>
            </div>
        ))}
      </div>
      
      <button onClick={() => setShowDriverModal(true)} className="mt-8 px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl">Register to Become a Driver</button>
      <button onClick={() => setActiveView('home')} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl">Back to Home</button>

      {/* Driver Onboarding Modal */}
      <DriverOnboardingModal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
      />
    </div>
  );
};
