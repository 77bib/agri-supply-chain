import mongoose, { Schema, Document } from 'mongoose'

export interface ITraceability extends Document {
  productId: mongoose.Types.ObjectId
  batchId: string
  qrCode: string
  blockchainHash: string
  journey: Array<{
    stage: 'harvest' | 'processing' | 'packaging' | 'storage' | 'transport' | 'delivery' | 'retail'
    location: {
      name: string
      address: string
      coordinates: {
        lat: number
        lng: number
      }
    }
    timestamp: Date
    operator: {
      id: mongoose.Types.ObjectId
      name: string
      role: string
    }
    data: {
      temperature?: number
      humidity?: number
      quality?: string
      notes?: string
      images?: string[]
      documents?: string[]
    }
    verification: {
      verified: boolean
      verifiedBy?: mongoose.Types.ObjectId
      verificationDate?: Date
      method: 'qr_scan' | 'blockchain' | 'manual' | 'iot_sensor'
    }
  }>
  certifications: Array<{
    type: string
    issuer: string
    issueDate: Date
    expiryDate: Date
    status: 'active' | 'expired' | 'suspended'
    certificateUrl?: string
  }>
  qualityChecks: Array<{
    stage: string
    date: Date
    inspector: {
      id: mongoose.Types.ObjectId
      name: string
      certification: string
    }
    parameters: {
      moisture: number
      purity: number
      defects: number
      contaminants: number
    }
    result: 'pass' | 'fail' | 'conditional'
    notes: string
    images: string[]
  }>
  environmentalData: Array<{
    timestamp: Date
    location: {
      lat: number
      lng: number
    }
    temperature: number
    humidity: number
    pressure: number
    source: 'iot_sensor' | 'manual' | 'weather_api'
  }>
  alerts: Array<{
    type: 'quality_issue' | 'temperature_deviation' | 'route_deviation' | 'verification_failed'
    message: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    timestamp: Date
    resolved: boolean
    resolvedBy?: mongoose.Types.ObjectId
    resolutionNotes?: string
  }>
  consumerAccess: {
    publicUrl: string
    qrCodeUrl: string
    lastAccessed: Date
    accessCount: number
  }
  status: 'active' | 'completed' | 'suspended' | 'archived'
  createdAt: Date
  updatedAt: Date
}

const TraceabilitySchema = new Schema<ITraceability>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  batchId: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  blockchainHash: {
    type: String,
    required: true,
    unique: true
  },
  journey: [{
    stage: {
      type: String,
      enum: ['harvest', 'processing', 'packaging', 'storage', 'transport', 'delivery', 'retail'],
      required: true
    },
    location: {
      name: {
        type: String,
        required: true
      },
      address: {
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
    timestamp: {
      type: Date,
      required: true
    },
    operator: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      }
    },
    data: {
      temperature: {
        type: Number
      },
      humidity: {
        type: Number
      },
      quality: {
        type: String
      },
      notes: {
        type: String
      },
      images: [{
        type: String
      }],
      documents: [{
        type: String
      }]
    },
    verification: {
      verified: {
        type: Boolean,
        default: false
      },
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      verificationDate: {
        type: Date
      },
      method: {
        type: String,
        enum: ['qr_scan', 'blockchain', 'manual', 'iot_sensor'],
        required: true
      }
    }
  }],
  certifications: [{
    type: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'suspended'],
      default: 'active'
    },
    certificateUrl: {
      type: String
    }
  }],
  qualityChecks: [{
    stage: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    inspector: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      certification: {
        type: String,
        required: true
      }
    },
    parameters: {
      moisture: {
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
      },
      contaminants: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    },
    result: {
      type: String,
      enum: ['pass', 'fail', 'conditional'],
      required: true
    },
    notes: {
      type: String
    },
    images: [{
      type: String
    }]
  }],
  environmentalData: [{
    timestamp: {
      type: Date,
      required: true
    },
    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    temperature: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    },
    pressure: {
      type: Number,
      required: true
    },
    source: {
      type: String,
      enum: ['iot_sensor', 'manual', 'weather_api'],
      required: true
    }
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['quality_issue', 'temperature_deviation', 'route_deviation', 'verification_failed'],
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
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolutionNotes: {
      type: String
    }
  }],
  consumerAccess: {
    publicUrl: {
      type: String,
      required: true
    },
    qrCodeUrl: {
      type: String,
      required: true
    },
    lastAccessed: {
      type: Date,
      default: null
    },
    accessCount: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'suspended', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Indexes for better query performance
TraceabilitySchema.index({ productId: 1 })
TraceabilitySchema.index({ batchId: 1 })
TraceabilitySchema.index({ qrCode: 1 })
TraceabilitySchema.index({ blockchainHash: 1 })
TraceabilitySchema.index({ status: 1 })
TraceabilitySchema.index({ 'journey.stage': 1 })
TraceabilitySchema.index({ 'journey.timestamp': 1 })

export default mongoose.models.Traceability || mongoose.model<ITraceability>('Traceability', TraceabilitySchema) 