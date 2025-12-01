import React, { useEffect, useState } from 'react';
import { OnboardingAPI } from '../services/endpoints';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    experience: 'beginner',
    riskTolerance: 'moderate',
    goals: 'wealth_growth',
    markets: ['US'],
    investmentAmount: 1000,
  });

  useEffect(() => {
    // Attempt to fetch existing onboarding data (optional)
    (async () => {
      try {
        const data = await OnboardingAPI.get();
        if (data) setForm((f) => ({ ...f, ...data }));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const toggleMarket = (m) => {
    setForm((f) => {
      const has = f.markets.includes(m);
      return { ...f, markets: has ? f.markets.filter(x => x !== m) : [...f.markets, m] };
    });
  };

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      await OnboardingAPI.save(form);
      window.location.href = '/dashboard';
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save onboarding');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1>Onboarding</h1>
      <div className="card">
        {step === 1 && (
          <>
            <h3>Experience</h3>
            <p className="label">Tell us about your investing experience</p>
            <select className="input" value={form.experience} onChange={(e)=>setForm(f=>({...f, experience:e.target.value}))}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </>
        )}
        {step === 2 && (
          <>
            <h3>Risk tolerance</h3>
            <p className="label">Choose your comfort level</p>
            <select className="input" value={form.riskTolerance} onChange={(e)=>setForm(f=>({...f, riskTolerance:e.target.value}))}>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </>
        )}
        {step === 3 && (
          <>
            <h3>Goals</h3>
            <p className="label">What brings you here?</p>
            <select className="input" value={form.goals} onChange={(e)=>setForm(f=>({...f, goals:e.target.value}))}>
              <option value="wealth_growth">Wealth Growth</option>
              <option value="income">Income</option>
              <option value="capital_preservation">Capital Preservation</option>
            </select>
          </>
        )}
        {step === 4 && (
          <>
            <h3>Markets & Amount</h3>
            <p className="label">Choose markets and amount to invest</p>
            <div className="actions">
              <label><input type="checkbox" checked={form.markets.includes('US')} onChange={()=>toggleMarket('US')} /> US</label>
              <label><input type="checkbox" checked={form.markets.includes('India')} onChange={()=>toggleMarket('India')} /> India</label>
            </div>
            <div className="form-row" style={{ marginTop: 12 }}>
              <label className="label">Investment Amount (USD or INR equivalent)</label>
              <input className="input" type="number" min="0" value={form.investmentAmount} onChange={(e)=>setForm(f=>({...f, investmentAmount:Number(e.target.value)}))} />
            </div>
          </>
        )}

        {error && <div style={{ color: 'var(--error)', marginTop: 8 }}>{error}</div>}
        <div className="actions" style={{ marginTop: 16 }}>
          {step > 1 && <button className="btn-outline" onClick={back}>Back</button>}
          {step < 4 && <button className="btn" onClick={next}>Next</button>}
          {step === 4 && <button className="btn" onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Finish'}</button>}
        </div>
      </div>
    </div>
  );
}
