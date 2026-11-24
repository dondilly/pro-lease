import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from 'react'
import type { Property as PropertyRecord } from '../interfaces'
import DataTable from './DataTable.jsx'
import './Property.css'

const initialProperties: PropertyRecord[] = [
  {
    propertyCode: 'PL-001',
    name: 'Riverside Apartments',
    addressLine1: '120 Riverside Drive',
    addressLine2: 'Suite 100',
    city: 'Austin',
    region: 'Texas',
    postalCode: '78701',
    countryCode: 'US',
  },
  {
    propertyCode: 'PL-002',
    name: 'Oak View',
    addressLine1: '440 Oak Street',
    city: 'Dallas',
    region: 'Texas',
    postalCode: '75201',
    countryCode: 'US',
  },
  {
    propertyCode: 'PL-003',
    name: 'Central Plaza',
    addressLine1: '800 Main Avenue',
    addressLine2: 'Floor 4',
    city: 'Houston',
    region: 'Texas',
    postalCode: '77002',
    countryCode: 'US',
  },
]

const columns = [
  { accessor: 'propertyCode', header: 'Code' },
  { accessor: 'name', header: 'Property' },
  { accessor: 'addressLine1', header: 'Address' },
  { accessor: 'addressLine2', header: 'Address line 2' },
  { accessor: 'city', header: 'City' },
  { accessor: 'region', header: 'Region' },
  { accessor: 'postalCode', header: 'Postal code' },
  { accessor: 'countryCode', header: 'Country' },
]

const fields: Array<{
  name: keyof PropertyRecord
  label: string
  required?: boolean
}> = [
  { name: 'propertyCode', label: 'Property code', required: true },
  { name: 'name', label: 'Property name', required: true },
  { name: 'addressLine1', label: 'Address line 1', required: true },
  { name: 'addressLine2', label: 'Address line 2' },
  { name: 'city', label: 'City', required: true },
  { name: 'region', label: 'Region / state', required: true },
  { name: 'postalCode', label: 'Postal code', required: true },
  { name: 'countryCode', label: 'Country code', required: true },
]

const emptyProperty: PropertyRecord = {
  propertyCode: '',
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  postalCode: '',
  countryCode: '',
}

function Property() {
  const [properties, setProperties] = useState(initialProperties)
  const [formValues, setFormValues] = useState(emptyProperty)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (dialogOpen && !dialog.open) {
      dialog.showModal()
    } else if (!dialogOpen && dialog.open) {
      dialog.close()
    }
  }, [dialogOpen])

  function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const field = fields.find((item) => item.name === event.currentTarget.name)
    if (!field) return

    const value = event.currentTarget.value
    setFormValues((current) => ({ ...current, [field.name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const propertyCode = formValues.propertyCode.trim().toUpperCase()
    if (properties.some((property) => property.propertyCode.toUpperCase() === propertyCode)) {
      setFormError('A property with this code already exists.')
      return
    }

    setProperties((current) => [
      ...current,
      {
        ...formValues,
        propertyCode,
        name: formValues.name.trim(),
        addressLine1: formValues.addressLine1.trim(),
        addressLine2: formValues.addressLine2?.trim() || undefined,
        city: formValues.city.trim(),
        region: formValues.region.trim(),
        postalCode: formValues.postalCode.trim(),
        countryCode: formValues.countryCode.trim().toUpperCase(),
      },
    ])
    setFormValues(emptyProperty)
    setFormError('')
    setDialogOpen(false)
  }

  function openDialog() {
    setFormValues(emptyProperty)
    setFormError('')
    setDialogOpen(true)
  }

  return (
    <section className="m-card property-page" aria-labelledby="property-page-title">
      <header className="m-card__header property-page__header">
        <div>
          <h1 className="m-card__title" id="property-page-title">Properties</h1>
          <p className="m-card__subtitle">View and manage your property portfolio.</p>
        </div>
        <button className="m-btn m-btn--primary" type="button" onClick={openDialog}>
          <i className="fa-solid fa-plus" aria-hidden="true"></i>
          Add property
        </button>
      </header>

      <DataTable
        columns={columns}
        data={properties}
        emptyMessage="No properties have been added yet."
        rowKey="propertyCode"
        searchPlaceholder="Search properties..."
      />

      <dialog
        className="property-dialog"
        ref={dialogRef}
        aria-labelledby="property-dialog-title"
        onClose={() => setDialogOpen(false)}
      >
        <form className="property-form" onSubmit={handleSubmit}>
          <header className="property-dialog__header">
            <div>
              <h2 id="property-dialog-title">Add property</h2>
              <p>Enter the property details below.</p>
            </div>
            <button
              className="property-dialog__close"
              type="button"
              aria-label="Close dialog"
              onClick={() => setDialogOpen(false)}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <div className="property-form__fields">
            {fields.map((field) => (
              <label className="property-form__field" htmlFor={`property-${field.name}`} key={field.name}>
                <span>{field.label}{field.required && <span aria-hidden="true"> *</span>}</span>
                <input
                  autoComplete="off"
                  id={`property-${field.name}`}
                  name={field.name}
                  onChange={handleFieldChange}
                  required={field.required}
                  value={formValues[field.name] ?? ''}
                />
              </label>
            ))}
          </div>

          {formError && <p className="property-form__error" role="alert">{formError}</p>}

          <footer className="property-dialog__actions">
            <button
              className="m-btn m-btn--ghost"
              type="button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
            <button className="m-btn m-btn--primary" type="submit">Save property</button>
          </footer>
        </form>
      </dialog>
    </section>
  )
}

export default Property