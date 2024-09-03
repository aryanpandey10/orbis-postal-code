import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PostalCodeSearch = () => {
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch addresses based on postal code
  const fetchAddresses = async (value) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.easypostcodes.com/addresses/${value}`,
        {
          headers: { Key: "370HXGjnJgM5xvU6M3ZrPjjh96DhQklxdWcfbAsEMs" },
        }
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handlePostcodeChange = (e) => {
    setPostcode(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (postcode.length >= 3) {
      fetchAddresses(postcode);
    }
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setAddresses([]);
    setPostcode("");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Postal Code Search</h2>
      <div className="mb-3 position-relative d-flex">
        <input
          type="text"
          className="form-control"
          id="postcode"
          value={postcode}
          onChange={handlePostcodeChange}
          placeholder="Enter postal code"
          autoComplete="off"
        />
        <button
          className="btn btn-primary ms-2"
          onClick={handleSearchClick}
          disabled={postcode.length < 3 || isLoading}
        >
          Search
        </button>

        {/* Loading Spinner */}
        {isLoading && (
          <div
            className="spinner-border text-primary ms-2 align-self-center"
            role="status"
          ></div>
        )}
      </div>

      {/* Display all addresses after search */}
      {addresses.length > 0 && (
        <ul className="list-group mt-2">
          {addresses.map((address, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleAddressSelect(address)}
              style={{ cursor: "pointer" }}
            >
              {address.envelopeAddress.summaryLine}
            </li>
          ))}
        </ul>
      )}

      {/* Card to display the selected address */}
      {selectedAddress && (
        <div className="card mt-4">
          <div className="card-header">Selected Address</div>
          <div className="card-body">
            <h5 className="card-title">
              {selectedAddress.envelopeAddress.addressLine1}
            </h5>
            <p className="card-text">
              {selectedAddress.envelopeAddress.addressLine2}
            </p>
            <p className="card-text">
              {selectedAddress.envelopeAddress.town},{" "}
              {selectedAddress.envelopeAddress.postCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostalCodeSearch;
