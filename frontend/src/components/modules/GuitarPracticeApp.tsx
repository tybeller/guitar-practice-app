import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Plus, X, Music, Clock, Notebook, FileText, Settings } from 'lucide-react';

// Shadcn UI components (to be imported from your actual implementation)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Make the grid layout responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

// Module types with their icons and names
const moduleTypes = [
  { id: 'metronome', name: 'Metronome', icon: <Music size={20} /> },
  { id: 'scales', name: 'Key/Scale Guide', icon: <Music size={20} /> },
  { id: 'timer', name: 'Timer', icon: <Clock size={20} /> },
  { id: 'tuner', name: 'Tuner', icon: <Music size={20} /> },
  { id: 'chords', name: 'Chord Book', icon: <Music size={20} /> },
  { id: 'journal', name: 'Practice Journal', icon: <Notebook size={20} /> },
  { id: 'regimen', name: 'Practice Regimen', icon: <FileText size={20} /> },
];

// Demo components for each module type
const ModuleComponents = {
  metronome: () => <MetronomeModule />,
  scales: () => <ScalesModule />,
  timer: () => <TimerModule />,
  tuner: () => <TunerModule />,
  chords: () => <ChordsModule />,
  journal: () => <JournalModule />,
  regimen: () => <RegimenModule />,
};

// Simple Metronome component
const MetronomeModule = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="flex flex-col h-full p-4">
      <div className="text-4xl font-bold text-center mb-4">{bpm} BPM</div>
      <div className="mb-6">
        <Slider 
          value={[bpm]} 
          min={40} 
          max={220} 
          step={1} 
          onValueChange={(value) => setBpm(value[0])} 
        />
      </div>
      <div className="flex justify-center space-x-2">
        <Button 
          onClick={() => setBpm(Math.max(40, bpm - 5))}
          variant="outline"
        >
          -5
        </Button>
        <Button 
          onClick={() => setIsPlaying(!isPlaying)}
          variant={isPlaying ? "destructive" : "default"}
        >
          {isPlaying ? "Stop" : "Start"}
        </Button>
        <Button 
          onClick={() => setBpm(Math.min(220, bpm + 5))}
          variant="outline"
        >
          +5
        </Button>
      </div>
    </div>
  );
};

// Placeholder components for other modules
const ScalesModule = () => (
  <div className="p-4">
    <Tabs defaultValue="major">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="major">Major</TabsTrigger>
        <TabsTrigger value="minor">Minor</TabsTrigger>
      </TabsList>
      <TabsContent value="major" className="mt-2">
        Major scales content...
      </TabsContent>
      <TabsContent value="minor" className="mt-2">
        Minor scales content...
      </TabsContent>
    </Tabs>
  </div>
);

const TimerModule = () => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="text-5xl font-mono mb-4">25:00</div>
    <Button>Start Timer</Button>
  </div>
);

const TunerModule = () => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="text-6xl font-bold mb-2">E</div>
    <div className="text-sm mb-4">Turn tuning peg ↑</div>
    <Button>Activate Tuner</Button>
  </div>
);

const ChordsModule = () => (
  <div className="p-4">Chord library content...</div>
);

const JournalModule = () => (
  <div className="p-4">Practice journal entries...</div>
);

const RegimenModule = () => (
  <div className="p-4">Practice routine timer...</div>
);

// Main App Component
const GuitarPracticeApp = () => {
  // Track active modules
  const [activeModules, setActiveModules] = useState([
    { i: 'metronome1', x: 0, y: 0, w: 2, h: 3, type: 'metronome' },
    { i: 'scales1', x: 2, y: 0, w: 2, h: 3, type: 'scales' },
  ]);
  
  // Add a new module
  const addModule = (type) => {
    const newId = `${type}${Date.now()}`;
    setActiveModules([
      ...activeModules,
      {
        i: newId,
        x: (activeModules.length * 2) % 4,
        y: Infinity, // Put it at the bottom
        w: 2,
        h: 3,
        type,
      },
    ]);
  };
  
  // Remove a module
  const removeModule = (id) => {
    setActiveModules(activeModules.filter((module) => module.i !== id));
  };
  
  // Layout change handler
  const onLayoutChange = (layout) => {
    const newModules = activeModules.map(module => {
      const updatedPosition = layout.find(item => item.i === module.i);
      return updatedPosition ? { ...module, ...updatedPosition } : module;
    });
    setActiveModules(newModules);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Guitar Practice Studio</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button size="sm">Save Layout</Button>
        </div>
      </header>
      
      {/* Module selection */}
      <div className="mb-6 flex flex-wrap gap-2">
        {moduleTypes.map((module) => (
          <Button
            key={module.id}
            variant="outline"
            size="sm"
            onClick={() => addModule(module.id)}
          >
            <Plus size={16} className="mr-1" />
            {module.icon}
            <span className="ml-1">{module.name}</span>
          </Button>
        ))}
      </div>
      
      {/* Grid layout for modules */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: activeModules }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
      >
        {activeModules.map((module) => (
          <div key={module.i} className="bg-card">
            <Card className="h-full overflow-hidden border rounded-lg">
              <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium flex items-center">
                  {moduleTypes.find(m => m.id === module.type)?.icon}
                  <span className="ml-2">
                    {moduleTypes.find(m => m.id === module.type)?.name}
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeModule(module.i)}
                >
                  <X size={14} />
                </Button>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-44px)]">
                {ModuleComponents[module.type]()}
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default GuitarPracticeApp;