import mongoose from 'mongoose'

const textSchema = new mongoose.Schema({
  owner: {
    type: String,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
    default: 'markdown',
  },
  data: {
    type: String,
  },
  visible: {
    type: String,
    default: 'private',
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform: doc => {
      return {
        owner: doc.owner,
        name: doc.name,
        type: doc.type,
        data: doc.data,
        visible: doc.visible,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      }
    }
  }
})

const Text = mongoose.model('Text', textSchema)

module.exports = Text
