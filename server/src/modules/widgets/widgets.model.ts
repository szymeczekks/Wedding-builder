import { Schema, model } from 'mongoose';

export interface IWidgetFieldOption {
	label: string;
	value: string;
}

export interface IWidgetField {
	name: string;
	label: string;
	type: string;
	options?: IWidgetFieldOption[];
	default?: any;
	placeholder?: string;
	required: boolean;
	itemType?: IWidgetField;
}

export interface IWidgetSchema {
	_id?: string;
	name: string;
	type: string;
	category?: string;
	icon?: string;
	description: string;
	fields: IWidgetField[];
	defaultConfig?: Record<string, any>;
	maxInstances: number;
	isPremium: boolean;
}

const FieldSchema = new Schema(
	{
		name: { type: String, required: true }, // np. 'backgroundColor', 'weddingDate'
		label: { type: String, required: true }, // np. 'Kolor tła', 'Data ślubu'
		type: {
			type: String,
			required: true,
			enum: ['text', 'textarea', 'number', 'color', 'image', 'select', 'checkbox', 'date', 'datetime', 'array'],
		},
		options: [Schema.Types.Mixed], // dla select - lista opcji
		default: Schema.Types.Mixed, // domyślna wartość
		placeholder: String,
		required: { type: Boolean, default: false },

		// Dla type: 'array' - definicja struktury elementów
		itemType: Schema.Types.Mixed, // struktura pojedynczego elementu tablicy
	},
	{ _id: false }
);

const WidgetSchema = new Schema(
	{
		name: { type: String, required: true }, // np. 'Odliczanie do ślubu'
		type: { type: String, required: true, unique: true }, // np. 'countdown', 'rsvp'
		category: {
			type: String,
			enum: ['essential', 'interactive', 'media', 'informational', 'decorative'],
		},
		icon: String, // ikona w panelu
		description: String,

		fields: [FieldSchema], // edytowalne pola
		defaultConfig: { type: Schema.Types.Mixed, required: true }, // początkowe wartości

		// Dodatkowe ustawienia
		maxInstances: Number, // np. 1 dla countdown - tylko jedna instancja na stronie
		isPremium: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

export const Widget = model('Widget', WidgetSchema);
