import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const SortableModule = ({ module, index, updateModule, deleteModule }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-4 rounded-lg bg-white"
    >
      <p className="text-sm text-gray-500 mb-1">Module {index + 1}</p>

      <p className="font-medium">{module.title}</p>

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => updateModule(module)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>

        <button
          onClick={() => deleteModule(module.id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const EditCourse = () => {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      const newModules = arrayMove(modules, oldIndex, newIndex);

      setModules(newModules);

      // Update lecture_order in DB
      try {
        for (let i = 0; i < newModules.length; i++) {
          await axiosInstance.put(`/modules/${newModules[i].id}`, {
            title: newModules[i].title,
            lecture_order: i + 1,
          });
        }

        toast.success("Module order updated");
      } catch {
        toast.error("Order update failed");
      }
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axiosInstance.get(`/modules/${courseId}`);
      setModules(res.data);
    } catch {
      toast.error("Failed to load modules");
    }
  };

  const updateModule = async (module) => {
    try {
      await axiosInstance.put(`/modules/${module.id}`, {
        title: module.title,
        lecture_order: module.lecture_order,
      });

      toast.success("Module updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete module?")) return;

    try {
      await axiosInstance.delete(`/modules/${id}`);

      toast.success("Module deleted");

      fetchModules();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Course Modules</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {modules.map((module, index) => (
              <SortableModule
                key={module.id}
                module={module}
                index={index}
                updateModule={updateModule}
                deleteModule={deleteModule}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default EditCourse;
