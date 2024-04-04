"use client";
import { useEffect, useState } from "react";
import {
  confirmTravelWithFriend,
  getTravelWithFriend,
} from "@/services/TravelWithFriendServices";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  TRAVEL_WITH_FRIEND_OPTIONS,
  TRAVEL_WITH_FRIEND_STATUS,
} from "@/utils/options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectField from "@/components/SelectField";
import ButtonAction from "@/components/ButtonAction";
import { Form, Formik } from "formik";

const TravelCard = ({ id, item, getData }) => {
  const [open, setOpen] = useState(false);

  const handleClick = async (values) => {
    const data = {
      id: id,
      day: item.day,
      status: values.status,
      route: item.route,
      fullName: `${item?.studentRequest?.name} ${
        item?.studentRequest?.lastName || ""
      } ${item?.studentRequest?.secondLastName || ""}`,
      student: item.student,
      schoolId: item.routeData.schoolId,
      studentRequest: item.studentRequest.id,
    };
    try {
      await confirmTravelWithFriend(data);
      getData();
      toast.success("Viaje actualizado");
    } catch (error) {
      toast.error(error?.message || "Error al actualizar el viaje");
    } finally {
      setOpen(false);
    }
  };

  const initialValues = {
    status: item.status,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer">
          <CardContent className="p-0 cursor-pointer">
            <div className="grid grid-cols-2 p-4 gap-1">
              <Label className="font-bold text-base cursor-pointer">
                Fecha:
              </Label>
              <Label className="text-base cursor-pointer">
                {new Date(item.date).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Label>
              <Label className="font-bold text-base cursor-pointer">
                Nombre Solicitante:
              </Label>
              <Label className="text-base cursor-pointer">
                {`${item?.studentRequest?.name} ${
                  item?.studentRequest?.lastName || ""
                } ${item?.studentRequest?.secondLastName || ""}`}
              </Label>
              <Label className="font-bold text-base cursor-pointer">
                Nombre Acompañante:
              </Label>
              <Label className="text-base cursor-pointer">
                {`${item?.studentFriend?.name} ${
                  item?.studentFriend?.lastName || ""
                } ${item?.studentFriend?.secondLastName || ""}`}
              </Label>
              <Label className="font-bold text-base cursor-pointer">
                Ruta por asignar:
              </Label>
              <Label className="text-base cursor-pointer">
                {item?.routeData?.name}
              </Label>
              <Label className="font-bold text-xl cursor-pointer">
                Estado:
              </Label>
              <Label className="text-xl cursor-pointer">
                {TRAVEL_WITH_FRIEND_STATUS[item.status]}
              </Label>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <Formik
        initialValues={initialValues}
        onSubmit={handleClick}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {({ isSubmitting, handleSubmit, handleChange, values }) => (
          <Form>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Actualizar estado</DialogTitle>
                <DialogDescription>
                  Actualiza el estado del viaje con amigo
                </DialogDescription>
              </DialogHeader>
              <div className="grid py-2">
                <div>
                  <SelectField
                    label="Estado"
                    name="status"
                    options={TRAVEL_WITH_FRIEND_OPTIONS}
                    value={values.status}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <ButtonAction onClick={handleSubmit} disabled={isSubmitting}>
                  Guardar
                </ButtonAction>
              </DialogFooter>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const Page = ({ params }) => {
  const [data, setData] = useState();

  const getData = async () => {
    try {
      const response = await getTravelWithFriend(params?.id);
      setData(response);
    } catch (error) {
      toast.error(error?.message || "Error al obtener los datos");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="container mx-auto my-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Label className="text-3xl">Viajes solicitados</Label>
          </CardTitle>
          <CardContent>
            <div className="grid grid-cols-2 mt-4">
              {data &&
                data.map((item) => (
                  <TravelCard
                    item={item}
                    key={item.day}
                    id={params?.id}
                    getData={getData}
                  />
                ))}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Page;
