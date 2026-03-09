'use client';

import { useConfigurator } from '@/hooks/useConfigurator';
import SidePanel from '@/components/configurator/SidePanel';
import OptionCard from '@/components/configurator/OptionCard';
import ReviewPanel from '@/components/configurator/ReviewPanel';
import NotificationToast from '@/components/ui/NotificationToast';
import Vehicle3DViewer from '@/components/configurator/Vehicle3DViewer';
import type { Option } from '@/types';
import { formatPrice } from '@/lib/engine/pricing';
// ... (imports remain)
import { STEPS } from '@/types';

export default function Home() {
  const {
    model,
    options,
    currentStep,
    selections,
    packageSelections,
    disabledOptionIds,
    pricing,
    currentCategory,
    currentOptions,
    notifications,
    isInitializing,
    dbModels,
    selectModel,
    selectOption,
    goToStep,
    nextStep,
    prevStep,
    clearModel,
  } = useConfigurator();

  // Full screen loading state while pulling config tree from Supabase
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-maserati-navy dark:bg-maserati-navy bg-white flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <div className="text-center animate-pulse">
          <h1 className="text-maserati-accent font-display text-2xl tracking-[0.2em] mb-4">AUTONOVA</h1>
          <p className="text-white/60 text-sm tracking-widest uppercase">Connecting to Database...</p>
        </div>
      </div>
    );
  }

  // If no model is selected, ONLY render the Model Selection Screen
  if (!model) {
    return (
      <div className="min-h-screen bg-maserati-navy dark:bg-maserati-navy bg-white flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <div className="text-center mb-12 animate-fade-in">
          <svg viewBox="0 0 40 40" className="w-16 h-16 mx-auto mb-6 text-maserati-accent" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" className="text-maserati-accent/40" />
            <path d="M20 8 L26 20 L20 32 L14 20 Z" fill="currentColor" />
          </svg>
          <h1 className="text-maserati-navy dark:text-white font-display text-4xl mb-4">Select Your Model</h1>
          <p className="text-maserati-navy/60 dark:text-white/60 max-w-lg mx-auto">
            Begin your journey by choosing the foundation of your bespoke Maserati configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full animate-slide-up">
          {dbModels.map((m) => (
            <div
              key={m.id}
              className="glass-card bg-white/60 dark:bg-white/5 overflow-hidden group hover:border-maserati-accent/50 transition-all duration-500 flex flex-col"
            >
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden">
                <img
                  src={m.image_url!}
                  alt={m.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-maserati-gray dark:via-transparent dark:to-transparent"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col cursor-pointer" onClick={() => selectModel(m.id)}>
                <h2 className="text-3xl font-display text-maserati-navy dark:text-white mb-2">{m.name}</h2>
                <p className="text-maserati-navy/60 dark:text-white/60 text-sm mb-6 max-w-md">{m.description}</p>

                {/* Specs Section */}
                <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-black/10 dark:border-white/10">
                  <div>
                    <p className="text-[10px] text-maserati-navy/50 dark:text-white/50 uppercase tracking-[0.2em] mb-1">Engine</p>
                    <p className="text-sm text-maserati-navy dark:text-white font-medium">{m.specs?.engine}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-maserati-navy/50 dark:text-white/50 uppercase tracking-[0.2em] mb-1">Max Power</p>
                    <p className="text-sm text-maserati-navy dark:text-white font-medium">{m.specs?.horsepower}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-maserati-navy/50 dark:text-white/50 uppercase tracking-[0.2em] mb-1">0-60 mph</p>
                    <p className="text-sm text-maserati-navy dark:text-white font-medium">{m.specs?.acceleration}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-maserati-accent/80 text-[10px] tracking-widest uppercase mb-1">Starting From</p>
                    <p className="text-xl text-maserati-navy dark:text-white font-medium">{formatPrice(m.base_price)}</p>
                  </div>
                  <button className="btn-outline px-6 py-2 border-maserati-navy dark:border-white text-maserati-navy dark:text-white group-hover:bg-maserati-navy group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    Build Your Own
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isReview = currentStep >= STEPS.length;
  const currentStepInfo = !isReview ? STEPS[currentStep] : null;

  // Extract selected colors for the Image viewer
  const exteriorId = selections['exterior'];
  const trimId = selections['trim'];
  const interiorId = selections['interior'];

  const p_exteriorColor = options.find((o: Option) => o.id === exteriorId)?.name || 'Bianco Alpi (White)';
  const p_interiorColor = options.find((o: Option) => o.id === interiorId)?.name || 'Nero Premium Leather';
  const p_trimLevel = options.find((o: Option) => o.id === trimId)?.name || 'GT';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-hero-gradient transition-all duration-500">
      <NotificationToast messages={notifications} />

      {/* Side Navigation Panel */}
      <SidePanel currentStep={currentStep} onGoToStep={goToStep} totalSteps={STEPS.length} clearModel={clearModel} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative lg:ml-[280px]">

        {/* Header - Mobile Only (Desktop logo is in SidePanel) */}
        <header className="lg:hidden z-30 absolute top-0 left-0 right-0 p-4 pointer-events-none flex justify-end">
          <div className="text-right bg-white/80 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full pointer-events-auto border border-black/10 dark:border-white/10">
            <p className="text-maserati-navy/60 dark:text-white/60 text-[10px] tracking-wider uppercase">Configuring</p>
            <p className="text-maserati-navy dark:text-white font-display text-sm">{model.name}</p>
          </div>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row h-full">
          {/* Hero / Visualization Section (Center/Left) */}
          <div className="flex-1 relative flex items-center justify-center min-h-[50vh] md:min-h-0">
            <Vehicle3DViewer
              modelUrl={model.model_url}
              category={currentCategory}
              exteriorColor={
                options.find((o) => o.id === selections.exterior)?.name || 'white'
              }
              interiorColor={
                options.find((o) => o.id === selections.interior)?.name || 'black'
              }
            />
          </div>
          {/* Desktop Trim Badge overlay */}
          <div className="hidden xl:block absolute bottom-8 left-8 pointer-events-none text-maserati-navy dark:text-white">
            <p className="font-display text-4xl mb-1">{model.name}</p>
            <div className="inline-flex items-center px-3 py-1 border border-maserati-accent/40 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <span className="text-maserati-accent text-xs tracking-widest uppercase font-semibold">{p_trimLevel}</span>
            </div>
          </div>

          {/* Configuration Options Section (Right) */}
          <section className="w-full xl:w-[480px] flex-shrink-0 flex flex-col h-full bg-white/50 dark:bg-white/5 backdrop-blur-md border-t border-black/10 dark:border-white/10 xl:border-t-0 xl:border-l z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {isReview ? (
                <ReviewPanel
                  modelName={model.name}
                  selections={selections}
                  packageSelections={packageSelections}
                  options={options}
                  pricing={pricing}
                  onGoToStep={goToStep}
                  onSaveQuote={() => alert('Quote saved! (POC)')}
                  onPlaceOrder={() => alert('Order placed! (POC)')}
                />
              ) : (
                <div className="animate-slide-in-right">
                  {/* Step Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{currentStepInfo?.icon}</span>
                      <h2 className="font-display text-2xl text-maserati-navy dark:text-white">
                        {currentStepInfo?.label}
                      </h2>
                    </div>
                    <p className="text-maserati-navy/60 dark:text-white/50 text-sm">
                      {currentCategory === 'engine' && 'Select your powertrain for the ultimate driving experience.'}
                      {currentCategory === 'trim' && 'Choose the character that defines your Maserati.'}
                      {currentCategory === 'exterior' && 'Express yourself with the perfect finish.'}
                      {currentCategory === 'interior' && 'Immerse yourself in Italian craftsmanship.'}
                      {currentCategory === 'wheels' && 'Complete the look with the perfect set of wheels.'}
                      {currentCategory === 'package' && 'Enhance your Maserati with curated packages.'}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-4">
                    {currentOptions.map((option: Option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        isSelected={
                          currentCategory === 'package'
                            ? packageSelections.has(option.id)
                            : selections[currentCategory!] === option.id
                        }
                        isDisabled={disabledOptionIds.has(option.id)}
                        isPackage={currentCategory === 'package'}
                        onSelect={selectOption}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Floating Bar */}
            <div className="p-6 border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-maserati-navy/90 backdrop-blur-xl">
              {!isReview && (
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`
                        text-sm text-maserati-navy/50 dark:text-white/50 hover:text-maserati-navy dark:hover:text-white transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed
                      `}
                  >
                    &larr; Previous
                  </button>
                  <div className="text-xs tracking-widest uppercase text-maserati-navy/40 dark:text-white/30 font-semibold">
                    Step {currentStep + 1} / {STEPS.length}
                  </div>
                  <button
                    onClick={nextStep}
                    className="text-sm text-maserati-accent hover:text-maserati-gold transition-colors font-medium flex items-center gap-1"
                  >
                    {currentStep === STEPS.length - 1 ? 'Review' : 'Next'} &rarr;
                  </button>
                </div>
              )}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-maserati-navy/50 dark:text-white/40 mb-1">Total Price</p>
                  <div className="text-2xl font-display font-bold text-gradient">
                    {formatPrice(pricing.totalPrice)}
                  </div>
                </div>
                {isReview && (
                  <button onClick={() => alert('Order Placed!')} className="btn-accent px-6 py-2.5 text-sm">
                    Checkout
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

