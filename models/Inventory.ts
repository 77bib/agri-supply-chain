import mongoose, { Schema, Document } from 'mongoose'

export interface IInventory extends Document {
  batchId: string
  productId: mongoose.Types.ObjectId
  farmerId: mongoose.Types.ObjectId
  batchNumber: string
  harvestDate: Date
  expiryDate: Date
  quantity: number
  unit: 'kg' | 'tons' | 'pieces' | 'liters'
  quality: {
    grade: 'A' | 'B' | 'C' | 'D'
    moistureContent: number
    purity: number
    defects: number
  }
  storage: {
    warehouse: string
    location: string
    temperature: number
    humidity: number
    conditions: string[]
  }
  certifications: string[]
  status: 'available' | 'reserved' | 'shipped' | 'expired' | 'damaged'
  price: {
    cost: number
    sellingPrice: number
    currency: string
  }
  traceability: {
    origin: string
    processingHistory: Array<{
      stage: string
      date: Date
      operator: string
      notes: string
    }>
    qualityChecks: Array<{
      date: Date
      inspector: string
      result: 'pass' | 'fail'
      notes: string
    }>
  }
  alerts: Array<{
    type: 'low_stock' | 'expiry_warning' | 'quality_issue' | 'temperature_alert'
    message: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    timestamp: Date
    resolved: boolean
  }>
  createdAt: Date
  updatedAt: Date
}

const InventorySchema = new Schema<IInventory>({
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  harvestDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'tons', 'pieces', 'liters'],
    required: true
  },
  quality: {
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true
    },
    moistureContent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    purity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    defects: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  storage: {
    warehouse: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    conditions: [{
      type: String,
      enum: ['refrigerated', 'dry', 'ventilated', 'controlled_atmosphere', 'frozen']
    }]
  },
  certifications: [{
    type: String,
    enum: ['organic', 'fair_trade', 'rainforest_alliance', 'global_gap', 'iso_22000', 'halal', 'kosher']
  }],
  status: {
    type: String,
    enum: ['available', 'reserved', 'shipped', 'expired', 'damaged'],
    default: 'available'
  },
  price: {
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  traceability: {
    origin: {
      type: String,
      required: true
    },
    processingHistory: [{
      stage: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      operator: {
        type: String,
        required: true
      },
      notes: {
        type: String
      }
    }],
    qualityChecks: [{
      date: {
        type: Date,
        required: true
      },
      inspector: {
        type: String,
        required: true
      },
      result: {
        type: String,
        enum: ['pass', 'fail'],
        required: true
      },
      notes: {
        type: String
      }
    }]
  },
  alerts: [{
    type: {
      type: String,
      enum: ['low_stock', 'expiry_warning', 'quality_issue', 'temperature_alert'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
})

// Indexes for better query performance
InventorySchema.index({ batchId: 1 })
InventorySchema.index({ batchNumber: 1 })
InventorySchema.index({ productId: 1 })
InventorySchema.index({ farmerId: 1 })
InventorySchema.index({ status: 1 })
InventorySchema.index({ expiryDate: 1 })
InventorySchema.index({ 'quality.grade': 1 })
InventorySchema.index({ 'storage.warehouse': 1 })

export default mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema) 