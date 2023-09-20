import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const downloadURL = async (path) => {
  const storage = getStorage();
  try {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  } catch (error) {
    return { error: error?.message, code: error?.code };
  }
};

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validateServiceType = ({
  serviceType,
  setFieldValue,
  setBothTravels,
  values,
  bothTravels,
}) => {
  let element = null;
  const travelName = bothTravels ? "Ambos viajes" : "A la casa";

  switch (serviceType) {
    case "halfAfternoon":
      element = (
        <div className="flex flex-col ">
          <PlacesAutocomplete
            label={"A la casa"}
            setPlace={(value) => setFieldValue("temporalToHome", value)}
            place={values?.temporalToHome}
          />
          <p className="text-red ml-2 text-sm">Medio servicio*</p>
        </div>
      );
      break;
    case "halfMorning":
      element = (
        <div className="flex flex-col ">
          <PlacesAutocomplete
            label={"A la escuela"}
            setPlace={(value) => setFieldValue("temporalToSchool", value)}
            place={values?.temporalToSchool}
          />
          <p className="text-red ml-2 text-sm">Medio servicio*</p>
        </div>
      );
      break;
    case "complete":
      element = (
        <>
          <div className="form-control m-2">
            <label className="label cursor-pointer">
              <span className="label-text">Ambos viajes</span>
              <input
                type="checkbox"
                checked={bothTravels}
                className="checkbox"
                onChange={(e) => setBothTravels(e.target.checked)}
              />
            </label>
          </div>
          <div className="flex flex-row items-center">
            <PlacesAutocomplete
              label={travelName}
              setPlace={(value) => setFieldValue("temporalToHome", value)}
              place={values?.temporalToHome}
            />
          </div>
          {!bothTravels && (
            <div className="flex flex-row items-center">
              <PlacesAutocomplete
                label={"A la escuela"}
                setPlace={(value) => setFieldValue("temporalToSchool", value)}
                place={values?.temporalToSchool}
              />
            </div>
          )}
        </>
      );
      break;
    default:
      element = null;
      break;
  }
  return element;
};

export { downloadURL, generatePassword, validateEmail, validateServiceType };
