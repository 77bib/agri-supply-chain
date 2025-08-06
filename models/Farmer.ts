import mongoose, { Schema, Document } from 'mongoose'

export interface IFarmer extends Document {
  name: string
  email: string
  phone: string
  farmName: string
  farmSize: number // in hectares
  farmLocation: {
    address: string
    city: string
    state: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  certifications: string[]
  crops: string[]
  performance: {
    totalHarvested: number
    averageYield: number
    qualityScore: number
    lastHarvestDate: Date
  }
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  updatedAt: Date
}

const FarmerSchema = new Schema<IFarmer>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  farmName: {
    type: String,
    required: true,
    trim: true
  },
  farmSize: {
    type: Number,
    required: true,
    min: 0
  },
  farmLocation: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  certifications: [{
    type: String,
    enum: ['organic', 'fair_trade', 'rainforest_alliance', 'global_gap', 'iso_22000', 'halal', 'kosher']
  }],
  crops: [{
    type: String,
    enum: ['wheat', 'corn', 'soybeans', 'rice', 'cotton', 'vegetables', 'fruits', 'herbs', 'legumes']
  }],
  performance: {
    totalHarvested: {
      type: Number,
      default: 0
    },
    averageYield: {
      type: Number,
      default: 0
    },
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastHarvestDate: {
      type: Date,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Indexes for better query performance
FarmerSchema.index({ email: 1 })
FarmerSchema.index({ status: 1 })
FarmerSchema.index({ 'farmLocation.city': 1 })
FarmerSchema.index({ crops: 1 })
FarmerSchema.index({ certifications: 1 })

export default mongoose.models.Farmer || mongoose.model<IFarmer>('Farmer', FarmerSchema) 