import { MapPin, Calendar, UsersRound, Search } from "lucide-react";
export default function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <img
        src="/images/mountainClimber.png"
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="container relative z-10 mx-auto px-4 text-left">
        <p className="text-lg font-semibold text-terracotta-800">Unforgettable stays</p>
        <h1 className="text-4xl font-bold text-neutral-900">Discover unique places to stay</h1>
        <p className="mt-4 text-lg text-neutral-700">
          From mountain cabins to seaside villas, find the perfect stay for your next adventure.
        </p>
        <div className="bg-teal-700 h-[52px] w-[770px] mt-6 rounded-[30px] flex items-center justify-center">
          <div className="flex items-center gap-4 divide-x divide-white">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-white" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="bg-transparent text-white placeholder-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-white" />
              <input
                type="text"
                placeholder="Check-in → Check-out"
                className="bg-transparent text-white placeholder-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <UsersRound size={20} className="text-white" />
              <input
                type="text"
                placeholder="Guests"
                className="bg-transparent text-white placeholder-white focus:outline-none"
              />
            </div>
            <button className="bg-teal-900 h-[40px] w-[40px] rounded-full flex items-center justify-center">
              <Search size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
