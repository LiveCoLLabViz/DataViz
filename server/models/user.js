import mongoose,{Schema} from "mongoose";


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["viewer", "admin", "editor"],
    default: "viewer",
  },

  // enum data type is used to define a set of allowed values for a field in a Mongoose schema. It restricts the value of the field to be one of the specified values in the enum array. In this case, the verificationStatus field can only have one of the three values: "pending", "verified", or "Rejected". If a value outside of this set is assigned to the verificationStatus field, Mongoose will throw a validation error.
  
});
const User = mongoose.model("user", userSchema);

export default User;
