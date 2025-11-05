import PageHeader from '@/components/PageHeader';
import PreferencesContent from '@/components/PreferencesContent';

export default function PreferencesPage() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Preferences" 
        description="Manage organization preferences and settings"
      />
      <PreferencesContent />
    </div>
  );
}

