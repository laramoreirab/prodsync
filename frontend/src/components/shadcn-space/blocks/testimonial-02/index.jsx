import Testimonial01Inner from "@/components/shadcn-space/blocks/testimonial-02/testimonial";

const defaultTestimonials = [
    {
        quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: "Laura Silva",
        role: "CEO da BOSCH",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user.png",
    },
    {
        quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: "Errica Mcdowell",
        role: "Marketing Head",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user-2.png",
    },
];

export default function Testimonial01() {
    return (
        <main>
            <Testimonial01Inner testimonials={defaultTestimonials} />
        </main>
    );
}