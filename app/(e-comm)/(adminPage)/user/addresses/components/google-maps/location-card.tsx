import { LocationCardProps } from './types';
import { AutoLocationRow } from './auto-location-row';
import { LocationForm } from './location-form';

// Location Card Component
export const LocationCard = ({
  userLocation,
  selectedLocation,
  title,
  setTitle,
  editableAddress,
  setEditableAddress,
  landmark,
  setLandmark,
  deliveryNote,
  setDeliveryNote,
  onRecenter,
  onSave,
  onClear,
  locationProgress
}: LocationCardProps) => (
  <div className="bg-card rounded-xl border border-border/50 shadow-sm">
    {/* Auto Location Section */}
    <AutoLocationRow
      userLocation={userLocation}
      onRecenter={onRecenter}
      locationProgress={locationProgress}
    />

    {/* Form Section */}
    <div className="p-4">
      <LocationForm
        userLocation={userLocation}
        selectedLocation={selectedLocation}
        title={title}
        setTitle={setTitle}
        editableAddress={editableAddress}
        setEditableAddress={setEditableAddress}
        landmark={landmark}
        setLandmark={setLandmark}
        deliveryNote={deliveryNote}
        setDeliveryNote={setDeliveryNote}
        onRecenter={onRecenter}
        onSave={onSave}
        onClear={onClear}
      />
    </div>
  </div>
);
