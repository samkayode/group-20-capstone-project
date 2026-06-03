import "./form.css";
import { useState } from "react";

function Form() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const newErrors = {};

    if (!form.fullName.value.trim()) {
      newErrors.fullName = true;
    }

    if (!form.email.value.trim()) {
      newErrors.email = true;
    }

    if (!form.phone.value.trim()) {
      newErrors.phone = true;
    }

    if (!form.message.value.trim()) {
      newErrors.message = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      fetch("https://whitebricks.com/tsacademy.php", {
        method: "POST",
        body: new FormData(e.target),
      });

      alert("Form submitted successfully!");
    }

    if (!/^[0-9]+$/.test(form.phone.value.trim())) {
      newErrors.phone = true;
    }
  };

  return (
    <section id="form" className="contact-section">
      <div className="contact-container">
        <h2>Have Questions About Planetary Science?</h2>

        <p className="contact-text">
          Interested in learning more about space, astronomy, or how planetary
          data is collected and analyzed? Reach out and we'll get back to you.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Full Name
              <span className={errors.fullName ? "error-star" : ""}>*</span>
            </label>

            <input
              name="fullName"
              type="text"
              placeholder="Full name"
              className={errors.fullName ? "error-input" : ""}
            />
            {errors.fullName && (
              <small className="error-text">Full Name is required</small>
            )}
          </div>

          <div className="form-group">
            <label>
              Email
              <span className={errors.email ? "error-star" : ""}>*</span>
            </label>

            <input
              name="email"
              type="email"
              placeholder="example@example.com"
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && (
              <small className="error-text">Email is required</small>
            )}
          </div>

          <div className="form-group">
            <label>
              Phone Number
              <span className={errors.phone ? "error-star" : ""}>*</span>
            </label>

            <input
              name="phone"
              type="tel"
              placeholder="Please enter a valid phone number"
              className={errors.phone ? "error-input" : ""}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
            {errors.phone && (
              <small className="error-text">Phone Number is required</small>
            )}
          </div>

          <div className="form-group">
            <label>
              Message
              <span className={errors.message ? "error-star" : ""}>*</span>
            </label>

            <textarea
              name="message"
              placeholder="Enter your message"
              className={errors.message ? "error-input" : ""}
            ></textarea>
            {errors.message && (
              <small className="error-text">Message is required</small>
            )}

            <small>100 characters</small>
          </div>

          <button type="submit" className="submit-btn">
            Submit →
          </button>
        </form>
      </div>
    </section>
  );
}

export default Form;
