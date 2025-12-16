# KidAble Forms System

A comprehensive, accessible forms system for the KidAble Admin Panel, designed with therapist-friendly UX and reducing cognitive load.

## Overview

This forms system provides create, update, and delete functionality for all major entities in the KidAble platform. All forms follow consistent design patterns and best practices for pediatric therapy clinic workflows.

## Available Forms

### 1. **MoodEntryForm** - Mood Tracking
Track daily mood and emotional regulation for clients.

**Features:**
- Visual mood selection (emoji buttons)
- Zone of Regulation picker
- Energy level tracking
- Custom emoji support
- Notes field

**Usage:**
```tsx
import { FormDialog, MoodEntryForm, MoodEntryData } from '../forms';

const [open, setOpen] = useState(false);

const handleSubmit = (data: MoodEntryData) => {
  // Send to API
  console.log(data);
};

<FormDialog open={open} onOpenChange={setOpen} title="Log Mood">
  <MoodEntryForm
    onSubmit={handleSubmit}
    onCancel={() => setOpen(false)}
    parentId="parent-uuid"
  />
</FormDialog>
```

### 2. **JournalEntryForm** - Daily Journal Entries
Record detailed journal entries with zones, energy givers/drainers, and tags.

**Features:**
- Date and time selection
- Zone of Regulation (required)
- Energy givers/drainers text areas
- Relaxing activities
- Tag management (up to 20 tags)

**Usage:**
```tsx
import { JournalEntryForm, JournalEntryData } from '../forms';

<JournalEntryForm
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  parentId="parent-uuid"
/>
```

### 3. **HomeworkForm** - Assign Homework
Create and update homework assignments for clients.

**Features:**
- Title and description
- Therapy type selection
- Frequency targets (with templates)
- Step-by-step instructions builder
- Video URL support
- Related goal linking
- Active/inactive toggle

**Usage:**
```tsx
import { HomeworkForm, HomeworkFormData } from '../forms';

<HomeworkForm
  clientId="client-uuid"
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  availableGoals={[
    { id: 'goal-1', title: 'Improve communication' }
  ]}
  initialData={existingHomework} // For editing
/>
```

### 4. **HomeworkCompletionForm** - Log Homework Completion
Record homework completion with status and notes.

**Features:**
- Visual status selection (worked/not worked/yet to try/not started)
- Frequency count tracking
- Duration tracking
- Contextual tips based on status
- Notes field

**Usage:**
```tsx
import { HomeworkCompletionForm, HomeworkCompletionData } from '../forms';

<HomeworkCompletionForm
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  homeworkTitle="Practice counting"
  homeworkType="frequency" // or "duration" or "general"
/>
```

### 5. **GoalForm** - Create/Update Goals
Manage therapy goals with progress tracking.

**Features:**
- Title and description
- Therapy type and category
- Baseline and target values
- Target criteria and mastery criteria
- Status management (active/achieved/on hold/discontinued)
- Date tracking (start/target/achieved)

**Usage:**
```tsx
import { GoalForm, GoalFormData } from '../forms';

<GoalForm
  clientId="client-uuid"
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  initialData={existingGoal} // For editing
/>
```

### 6. **SessionForm** - Session Documentation
Comprehensive session logging with ABC data tracking.

**Features:**
- Session number and date
- Therapy type selection
- Long and short-term objectives
- **ABC Activities tracking** (Antecedent-Behavior-Consequence)
  - Multiple activities per session
  - Drag-to-reorder (visual indicator)
  - Prompt type selection
- Successes and struggles lists
- Interventions and strategies used
- Reinforcement types
- Session tags
- Accordion organization for reduced cognitive load

**Usage:**
```tsx
import { SessionForm, SessionFormData } from '../forms';

<SessionForm
  clientId="client-uuid"
  sessionNumber={15}
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
/>
```

### 7. **StrategyForm** - Manage Strategies
Create and assign therapeutic strategies.

**Features:**
- Strategy type (antecedent/reinforcement/regulation)
- When and how to use
- Step-by-step instructions
- General examples
- Client-specific customization (when assigning)
- Effectiveness rating
- Global vs. client-specific toggle

**Usage:**
```tsx
import { StrategyForm, StrategyFormData } from '../forms';

// Creating a global strategy
<StrategyForm
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  mode="create"
/>

// Assigning to a specific client
<StrategyForm
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  mode="assign"
  clientId="client-uuid"
/>
```

### 8. **ResourceForm** - Share Resources
Upload and share educational resources.

**Features:**
- Resource type (PDF/Video/Article/Worksheet/Link)
- Category selection
- File URL input with validation
- Share date tracking
- Client-specific notes (when sharing)
- Global resource toggle
- Helpful upload tips

**Usage:**
```tsx
import { ResourceForm, ResourceFormData } from '../forms';

// Creating a global resource
<ResourceForm
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  mode="create"
/>

// Sharing with a specific client
<ResourceForm
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  mode="share"
  clientId="client-uuid"
/>
```

### 9. **Team Forms** - Assign Therapists / Parents
Used on the Client detail “Team” tab to manage therapist and parent relationships.

**Available forms:**
- `TeamTherapistAssignForm` - Assign a therapist (optional primary flag)
- `TeamParentForm` - Link existing parent OR create a new parent inline (relationship + primary flag)
- `TeamParentEditForm` - Edit parent contact details + relationship + primary flag

**Usage:**
```tsx
import { FormDialog, TeamTherapistAssignForm, type TeamTherapistAssignData } from '../forms';

const [open, setOpen] = useState(false);

const handleSubmit = async (data: TeamTherapistAssignData) => {
  // API call here
  console.log(data);
  setOpen(false);
};

<FormDialog open={open} onOpenChange={setOpen} title="Add Therapist">
  <TeamTherapistAssignForm
    therapists={therapists}
    assignedTherapistIds={assignedIds}
    onSubmit={handleSubmit}
    onCancel={() => setOpen(false)}
  />
</FormDialog>
```

### 10. **AddClientForm** - Client Onboarding (Multi-step)
Multi-step onboarding used on the Clients page to create a client and optionally assign therapist/parent.

**Usage:**
```tsx
import { FormDialog, AddClientForm, type AddClientFormData } from '../forms';

const [open, setOpen] = useState(false);

const handleSubmit = async (data: AddClientFormData) => {
  // API calls:
  // 1) create client
  // 2) (optional) assign therapist
  // 3) (optional) link/create parent
  console.log(data);
  setOpen(false);
};

<FormDialog open={open} onOpenChange={setOpen} title="Add Client" maxWidth="3xl">
  <AddClientForm
    therapists={therapists}
    parents={parents}
    isSubmitting={isSubmitting}
    onSubmit={handleSubmit}
    onCancel={() => setOpen(false)}
  />
</FormDialog>
```

## Utility Components

### FormDialog
A responsive wrapper that uses Dialog on desktop and Sheet (bottom drawer) on mobile.

**Props:**
- `open: boolean` - Control visibility
- `onOpenChange: (open: boolean) => void` - Handle open/close
- `title: string` - Dialog title
- `description?: string` - Optional description
- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'` - Max width

### DeleteConfirmDialog
A consistent delete confirmation dialog with warning styling.

**Usage:**
```tsx
import { DeleteConfirmDialog } from '../forms';

<DeleteConfirmDialog
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  onConfirm={handleDelete}
  itemName="Morning Routine Homework"
  itemType="homework assignment"
/>
```

## Design Principles

### 1. Reduce Cognitive Load
- Accordions for long forms (SessionForm)
- Progressive disclosure
- Clear section headings
- Visual grouping of related fields

### 2. Smart Defaults
- Today's date pre-filled
- Current time pre-filled
- Sensible initial values

### 3. Helpful Validation
- Inline validation
- Clear error messages
- Character counters
- Visual feedback

### 4. Accessibility
- Proper label associations
- Keyboard navigation
- Screen reader friendly
- Focus management

### 5. Mobile-First
- Responsive layouts
- Touch-friendly targets
- Bottom sheets on mobile
- Flexible form layouts

### 6. Visual Feedback
- Toast notifications on success/error
- Loading states (ready for async operations)
- Color-coded status indicators
- Clear call-to-action buttons

## Theming

All forms use the KidAble color scheme:
- Primary: Forest Green (#0B5B45)
- Secondary: Warm Yellow (#F4D16B)
- Destructive actions clearly marked in red
- Consistent button styling across all forms

## Integration Pattern

Standard pattern for integrating forms into a component:

```tsx
import { useState } from 'react';
import { FormDialog, GoalForm, DeleteConfirmDialog } from '../forms';
import type { GoalFormData } from '../forms';

export function MyComponent() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSubmit = (data: GoalFormData) => {
    // API call here
    console.log(data);
    setFormOpen(false);
  };

  const handleDelete = () => {
    // API call here
    setDeleteOpen(false);
  };

  return (
    <>
      <Button onClick={() => setFormOpen(true)}>
        Add Goal
      </Button>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Add Goal"
      >
        <GoalForm
          clientId="client-id"
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          initialData={editingItem}
        />
      </FormDialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        itemType="goal"
      />
    </>
  );
}
```

## Next Steps

To connect forms to a real backend:

1. **Replace console.log with API calls:**
   ```tsx
   const handleSubmit = async (data: GoalFormData) => {
     try {
       await api.createGoal(data);
       toast.success('Goal created successfully');
       setFormOpen(false);
     } catch (error) {
       toast.error('Failed to create goal');
     }
   };
   ```

2. **Add loading states:**
   ```tsx
   const [isSubmitting, setIsSubmitting] = useState(false);
   
   // Disable submit button while submitting
   <Button type="submit" disabled={isSubmitting}>
     {isSubmitting ? 'Saving...' : 'Save'}
   </Button>
   ```

3. **Add optimistic updates:**
   - Update UI immediately
   - Revert on error

4. **Implement auto-save (optional):**
   - Use debouncing
   - Save drafts to localStorage

## TypeScript Support

All forms export their data types for type-safe integration:

```tsx
import type {
  MoodEntryData,
  JournalEntryData,
  HomeworkFormData,
  HomeworkCompletionData,
  GoalFormData,
  SessionFormData,
  SessionActivity,
  StrategyFormData,
  ResourceFormData,
} from '../forms';
```

## Questions or Issues?

All forms follow the DTOs provided in the API specification. If you need to modify a form to match updated API requirements, the form data interfaces can be updated accordingly.
